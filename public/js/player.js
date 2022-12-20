var overrideNative = false;

async function initPlayerLive(channel, dash, hls, poster = 'https://v--03-eu-west.3speakcontent.online/static/online.png') {
    window.player = videojs('player', {
            html5: {
                hls: {
                    overrideNative: overrideNative
                },
                nativeVideoTracks: !overrideNative,
                nativeAudioTracks: !overrideNative,
                nativeTextTracks: !overrideNative,
                nativeCaptions: false,
                dash: {
                    setLimitBitrateByPortal: true,
                    setMaxAllowedBitrateFor: ['video', 2000]
                }
            },
            errorDisplay: false,
            controls: true,
            autoplay: true,
            preload: "auto",
            html: {nativeCaptions: false},
            sources: [
                {
                    src: hls,
                    type: 'application/x-mpegURL'
                },

            ]
        },
        function () {
            player.hlsQualitySelector();
            player.poster(poster);
            player.on('canplay', () => {
                try {
                    player.play();
                } catch (e) {
                    console.log("> Failed to autoplay. please click the video to start")
                }
            });

            player.on('error', function (e) {
                player.posterImage.show();
                player.bigPlayButton.hide();
                player.pause();
            });


            player.on('ended', function (e) {
                alert("ended")
            });


            this.on('loadstart', function (e) {
                window.player.play().catch(e => {
                    console.log(e)
                })
            });

        }
    );
}