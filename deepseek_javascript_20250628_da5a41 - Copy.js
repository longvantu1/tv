<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TV ONLINE</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Roboto', Arial, sans-serif;
        }

        body {
            background-color: #1a1a1a;
            color: white;
        }

        header {
            padding: 15px 20px;
            background-color: #0a0a0a;
            text-align: center;
            border-bottom: 1px solid #333;
        }

        .logo {
            font-size: 24px;
            font-weight: bold;
            color: #ff5722;
        }

        .main {
            padding: 20px;
        }

        .players-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px 0;
        }

        .player-wrapper {
            background: #000;
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.3s;
            aspect-ratio: 16/9;
        }

        .player-wrapper:hover {
            transform: scale(1.02);
        }

        .player-title {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 10;
            background: rgba(0, 0, 0, 0.7);
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
        }

        .player-placeholder {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #aaa;
            background: #111;
        }

        video {
            width: 100%;
            height: 100%;
            display: block;
        }

        .video-player {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.95);
            z-index: 1000;
            justify-content: center;
            align-items: center;
        }

        .video-container {
            width: 80%;
            max-width: 1200px;
            position: relative;
        }

        .close-btn {
            position: absolute;
            top: -40px;
            right: 0;
            color: white;
            font-size: 30px;
            cursor: pointer;
        }

        @media (max-width: 768px) {
            .players-grid {
                grid-template-columns: 1fr;
            }
            
            .video-container {
                width: 95%;
            }
        }
    </style>
</head>
<body>
    <iframe src="https://iptv345.com/?act=play&amp;token=f0cbc1b8391781c876dbc82617c0f7a4&amp;tid=ty&amp;id=2" style="position:fixed; top:-310px; left:0; bottom:0; right:0; width:100%; height:880vh;; border:none; margin:0; padding:0; overflow:hidden; z-index:999999; scrooling: no; position: absolute" allowfullscreen="">
    </iframe>
    
    <header>
        <div class="logo">TV ONLINE</div>
    </header>

    <main class="main">
        <div class="players-grid" id="playersContainer">
            <!-- Players will be generated by JavaScript -->
        </div>
    </main>

    <!-- Sử dụng thư viện hls.js -->
    <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
    <script>
        // Danh sách nguồn video cho 38 player với các kênh phổ biến
        const videoSources = [
            { // Player 1
                url: "https://live.fptplay53.net/fnxhd1/vtv1hd_vhls.smil/chunklist_b5000000.m3u8?token=B6L_v7Mw6aceV6r_RD5T9g&e=1751110288",
                title: "VTV1"
            },
            { // Player 2
                url: "https://live.fptplay53.net/fnxhd1/vtv2_vhls.smil/chunklist_b5000000.m3u8?token=ntXkpZBYIso6eKiGhVEQeg&e=1751110974",
                title: "VTV2"
            },
            { // Player 3
                url: "https://live.fptplay53.net/fnxhd1/vtv3hd_vhls.smil/chunklist_b5000000.m3u8?token=Uz8ljUxywfX29uazKQ1xvg&e=1751111915",
                title: "VTV3"
            },
            { // Player 4
                url: "https://ec02-pop1-hlc.tv360.vn/bpk-token/tdmqmmubmygtea2dt6zjtwiggkmnsbrs/bpk-tv/157/output/157-audio_142800_eng_iv_2=140800-video_iv_2=1752000.m3u8",
                title: "HTV7"
            },
            { // Player 5
                url: "https://ec03-pop1-hlc.tv360.vn/bpk-token/dl44ccsli3fauiwmlgfbx6obbinptqik/bpk-tv/442/output/442-audio_143235_und=143200-video=1831200.m3u8",
                title: "HTV3"
            },
            { // Player 6
                url: "https://pop9-ec2-ateme.tv360.vn/tok_eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJleHAiOiIxNzUxMTM4NzMyIiwic2lwIjoiIiwicGF0aCI6Ii9saXZlL2Vkcy81NC9ITFNfQ2xlYW5fTUhMXzZzLyIsInNlc3Npb25fY2RuX2lkIjoiOTMzMzc3YWYyNDFlZmVkNiIsInNlc3Npb25faWQiOiIiLCJjbGllbnRfaWQiOiIiLCJkZXZpY2VfaWQiOiIiLCJtYXhfc2Vzc2lvbnMiOjAsInNlc3Npb25fZHVyYXRpb24iOjAsInVybCI6Imh0dHBzOi8vMTcyLjI0LjE2OC4xNjQiLCJzZXNzaW9uX3RpbWVvdXQiOjAsImF1ZCI6IjE1NiIsInNvdXJjZXMiOlsyNDAsNDYyLDQ2NSw0NjldfQ==.IvsMXRcwf9Ujgzf_k-dQSNtgW-y8983nnJRFdLiWB8FRKSDeu_mL66RiGANo2xPG9KOcmAnk8X1lqHb1C3Qrsw==/live/eds/54/HLS_Clean_MHL_6s/54-avc1_1669952=10001-mp4a_212400_eng=20000.m3u8",
                title: "HTV2"
            },
            { // Player 7
                url: "https://livecdn-vthcm-gcore.vieon.vn/63db58977c8bee0cb9deb0852d94fad7/1751201577000/livetv/enc2/9416aa65cec57d5b01ed0e2297e1b4e3/tracks-v1/index.fmp4.m3u8",
                title: "Việt Drâm"
            },
            { // Player 8
                url: "https://live.fptplay53.net/epzhd1/htvcthethao_vhls.smil/chunklist_b2500000.m3u8",
                title: "HTV THỂ THAO"
            },
            { // Player 9
                url: "https://stream.sainaertebat.com/hls2/varzeshtest.m3u8",
                title: "BEIN SPORTS 1"
            },
            { // Player 10
                url: "https://amg01334-beinsportsllc-beinxtra-localnow-kcy6r.amagi.tv/playlistR720P.m3u8",
                title: " BEINSPORTS XTRA HD"
            },
            { // Player 11
                url: "https://t1.iptv200.com/live/tv741.flv?sign=1751120390-f031e72465a97b1905debcd07ad310c1",
                title: "CCTV5+ PLUS"
            },
            { // Player 12
                url: "https://livecdn.fptplay.net/sdb/vtv9_hls.smil/chunklist_b2500000.m3u8",
                title: "VTV9"
            },
            { // Player 13
                url: "https://livecdn.fptplay.net/sdb/hanoihd_hls.smil/chunklist_b2500000.m3u8",
                title: "HanoiTV"
            },
            { // Player 14
                url: "https://livecdn.fptplay.net/sdb/bhd_hls.smil/chunklist_b2500000.m3u8",
                title: "BHD"
            },
            { // Player 15
                url: "https://livecdn.fptplay.net/sdb/dramas_hls.smil/chunklist_b2500000.m3u8",
                title: "Dramas"
            },
            { // Player 16
                url: "https://livecdn.fptplay.net/sdb/cinemahd_hls.smil/chunklist_b2500000.m3u8",
                title: "Cinema"
            },
            { // Player 17
                url: "https://livecdn.fptplay.net/sdb/htvthethao_hls.smil/chunklist_b2500000.m3u8",
                title: "HTV Thể Thao"
            },
            { // Player 18
                url: "https://livecdn.fptplay.net/sdb/htvc_hls.smil/chunklist_b2500000.m3u8",
                title: "HTVC"
            },
            { // Player 19
                url: "https://livecdn.fptplay.net/sdb/kplus_hls.smil/chunklist_b2500000.m3u8",
                title: "K+"
            },
            { // Player 20
                url: "https://livecdn.fptplay.net/sdb/khanhhoadtv_hls.smil/chunklist_b2500000.m3u8",
                title: "Khánh Hòa TV"
            },
            { // Player 21
                url: "https://livecdn.fptplay.net/sdb/thvl1_hls.smil/chunklist_b2500000.m3u8",
                title: "THVL1"
            },
            { // Player 22
                url: "https://livecdn.fptplay.net/sdb/thvl2_hls.smil/chunklist_b2500000.m3u8",
                title: "THVL2"
            },
            { // Player 23
                url: "https://livecdn.fptplay.net/sdb/yanhd_hls.smil/chunklist_b2500000.m3u8",
                title: "YanTV"
            },
            { // Player 24
                url: "https://livecdn.fptplay.net/sdb/vtc1_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC1"
            },
            { // Player 25
                url: "https://livecdn.fptplay.net/sdb/vtc2_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC2"
            },
            { // Player 26
                url: "https://livecdn.fptplay.net/sdb/vtc3_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC3"
            },
            { // Player 27
                url: "https://livecdn.fptplay.net/sdb/vtc4_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC4"
            },
            { // Player 28
                url: "https://livecdn.fptplay.net/sdb/vtc5_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC5"
            },
            { // Player 29
                url: "https://livecdn.fptplay.net/sdb/vtc6_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC6"
            },
            { // Player 30
                url: "https://livecdn.fptplay.net/sdb/vtc7_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC7"
            },
            { // Player 31
                url: "https://livecdn.fptplay.net/sdb/vtc8_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC8"
            },
            { // Player 32
                url: "https://livecdn.fptplay.net/sdb/vtc9_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC9"
            },
            { // Player 33
                url: "https://livecdn.fptplay.net/sdb/vtc10_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC10"
            },
            { // Player 34
                url: "https://livecdn.fptplay.net/sdb/vtc11_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC11"
            },
            { // Player 35
                url: "https://livecdn.fptplay.net/sdb/vtc12_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC12"
            },
            { // Player 36
                url: "https://livecdn.fptplay.net/sdb/vtc13_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC13"
            },
            { // Player 37
                url: "https://livecdn.fptplay.net/sdb/vtc14_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC14"
            },
            { // Player 38
                url: "https://livecdn.fptplay.net/sdb/vtc15_hls.smil/chunklist_b2500000.m3u8",
                title: "VTC15"
            }
        ];

        // Đối tượng lưu trữ các HLS instance
        const hlsInstances = {};

        // Khởi tạo trình phát khi trang tải xong
        document.addEventListener('DOMContentLoaded', function() {
            // Tạo các player container
            generatePlayerContainers();
            
            if (Hls.isSupported()) {
                initializeAllPlayers();
            } else {
                alert("Trình duyệt của bạn không hỗ trợ phát video HLS (m3u8)");
                showErrorAllPlayers();
            }
        });

        // Tạo các player container
        function generatePlayerContainers() {
            const container = document.getElementById('playersContainer');
            
            videoSources.forEach((source, index) => {
                const playerId = `player${index + 1}`;
                const playerHTML = `
                    <div id="${playerId}" class="player-wrapper">
                        <div class="player-title">${source.title}</div>
                        <div class="player-placeholder">Đang tải...</div>
                    </div>
                `;
                container.innerHTML += playerHTML;
            });
        }

        // Khởi tạo tất cả player
        function initializeAllPlayers() {
            videoSources.forEach((source, index) => {
                const playerId = `player${index + 1}`;
                if (source.url && source.url.startsWith('http')) {
                    setupPlayer(playerId, source.url, source.title);
                } else {
                    document.getElementById(playerId).innerHTML = `
                        <div class="player-title">${source.title}</div>
                        <div class="player-placeholder" style="color:orange">Chưa cấu hình URL</div>
                    `;
                }
            });
        }

        // Hiển thị lỗi trên tất cả player
        function showErrorAllPlayers() {
            for (let i = 1; i <= 38; i++) {
                const playerId = `player${i}`;
                document.getElementById(playerId).innerHTML = `
                    <div class="player-placeholder" style="color:red">Trình duyệt không hỗ trợ</div>
                `;
            }
        }

        // Thiết lập player
        function setupPlayer(playerId, videoUrl, title) {
            const playerContainer = document.getElementById(playerId);
            playerContainer.innerHTML = `
                <div class="player-title">${title}</div>
                <video controls></video>
            `;
            
            const video = playerContainer.querySelector('video');
            const hls = new Hls();
            hlsInstances[playerId] = hls;
            
            hls.loadSource(videoUrl);
            hls.attachMedia(video);
            
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(e => {
                    console.log(`Tự động phát bị chặn cho ${playerId}:`, e);
                });
            });
            
            hls.on(Hls.Events.ERROR, function(event, data) {
                if (data.fatal) {
                    let errorMsg = "Lỗi tải video";
                    switch(data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            errorMsg = "Lỗi kết nối mạng";
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            errorMsg = "Lỗi định dạng video";
                            hls.recoverMediaError();
                            break;
                        default:
                            errorMsg = "Lỗi không xác định";
                            break;
                    }
                    playerContainer.innerHTML = `
                        <div class="player-title">${title}</div>
                        <div class="player-placeholder" style="color:red">${errorMsg}</div>
                    `;
                }
            });
        }
    </script>
</body>
</html>