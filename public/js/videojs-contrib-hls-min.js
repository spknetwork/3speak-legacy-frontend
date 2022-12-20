! function e(t, i, n) {
    function r(s, o) {
        if (!i[s]) {
            if (!t[s]) {
                var u = "function" == typeof require && require;
                if (!o && u) return u(s, !0);
                if (a) return a(s, !0);
                var d = new Error("Cannot find module '" + s + "'");
                throw d.code = "MODULE_NOT_FOUND", d
            }
            var l = i[s] = {
                exports: {}
            };
            t[s][0].call(l.exports, function(e) {
                var i = t[s][1][e];
                return r(i || e)
            }, l, l.exports, e, t, i, n)
        }
        return i[s].exports
    }
    for (var a = "function" == typeof require && require, s = 0; s < n.length; s++) r(n[s]);
    return r
}({
    1: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function() {
                function e(e, t) {
                    var i = [],
                        n = !0,
                        r = !1,
                        a = undefined;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(n = (s = o.next()).done) && (i.push(s.value), !t || i.length !== t); n = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !n && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return i
                }
                return function(t, i) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, i);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            r = e(32),
            a = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(r),
            s = function(e, t) {
                for (var i = e.cues, n = 0; n < i.length; n++) {
                    var r = i[n];
                    if (t >= r.adStartTime && t <= r.adEndTime) return r
                }
                return null
            }, o = function(e, t) {
                var i = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
                if (e.segments) for (var r = i, o = undefined, u = 0; u < e.segments.length; u++) {
                    var d = e.segments[u];
                    if (o || (o = s(t, r + d.duration / 2)), o) {
                        if ("cueIn" in d) {
                            o.endTime = r, o.adEndTime = r, r += d.duration, o = null;
                            continue
                        }
                        if (r < o.endTime) {
                            r += d.duration;
                            continue
                        }
                        o.endTime += d.duration
                    } else if ("cueOut" in d && (o = new a["default"].VTTCue(r, r + d.duration, d.cueOut), o.adStartTime = r, o.adEndTime = r + parseFloat(d.cueOut), t.addCue(o)), "cueOutCont" in d) {
                        var l = undefined,
                            f = undefined,
                            c = d.cueOutCont.split("/").map(parseFloat),
                            h = n(c, 2);
                        l = h[0], f = h[1], o = new a["default"].VTTCue(r, r + d.duration, ""), o.adStartTime = r - l, o.adEndTime = o.adStartTime + f, t.addCue(o)
                    }
                    r += d.duration
                }
            };
        i["default"] = {
            updateAdCues: o,
            findAdCue: s
        }, t.exports = i["default"]
    }, {}],
    2: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function(e, t) {
            return e.start(t) + "-" + e.end(t)
        }, r = function(e, t) {
            var i = e.toString(16);
            return "00".substring(0, 2 - i.length) + i + (t % 2 ? " " : "")
        }, a = function(e) {
            return e >= 32 && e < 126 ? String.fromCharCode(e) : "."
        }, s = function(e) {
            var t = {};
            return Object.keys(e).forEach(function(i) {
                var n = e[i];
                ArrayBuffer.isView(n) ? t[i] = {
                    bytes: n.buffer,
                    byteOffset: n.byteOffset,
                    byteLength: n.byteLength
                } : t[i] = n
            }), t
        }, o = function(e) {
            var t = e.byterange || {
                length: Infinity,
                offset: 0
            };
            return [t.length, t.offset, e.resolvedUri].join(",")
        }, u = {
            hexDump: function(e) {
                for (var t = Array.prototype.slice.call(e), i = "", n = undefined, s = undefined, o = 0; o < t.length / 16; o++) n = t.slice(16 * o, 16 * o + 16).map(r).join(""), s = t.slice(16 * o, 16 * o + 16).map(a).join(""), i += n + " " + s + "\n";
                return i
            },
            tagDump: function(e) {
                return u.hexDump(e.bytes)
            },
            textRanges: function(e) {
                var t = "",
                    i = undefined;
                for (i = 0; i < e.length; i++) t += n(e, i) + " ";
                return t
            },
            createTransferableMessage: s,
            initSegmentId: o
        };
        i["default"] = u, t.exports = i["default"]
    }, {}],
    3: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        }), i["default"] = {
            GOAL_BUFFER_LENGTH: 30,
            MAX_GOAL_BUFFER_LENGTH: 60,
            GOAL_BUFFER_LENGTH_RATE: 1,
            BANDWIDTH_VARIANCE: 1.2,
            BUFFER_LOW_WATER_LINE: 0,
            MAX_BUFFER_LOW_WATER_LINE: 30,
            BUFFER_LOW_WATER_LINE_RATE: 1
        }, t.exports = i["default"]
    }, {}],
    4: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = e(32),
            r = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(n),
            a = e(25),
            s = e(2),
            o = function(e) {
                e.onmessage = function(e) {
                    var t = e.data,
                        i = new Uint8Array(t.encrypted.bytes, t.encrypted.byteOffset, t.encrypted.byteLength),
                        n = new Uint32Array(t.key.bytes, t.key.byteOffset, t.key.byteLength / 4),
                        o = new Uint32Array(t.iv.bytes, t.iv.byteOffset, t.iv.byteLength / 4);
                    new a.Decrypter(i, n, o, function(e, i) {
                        r["default"].postMessage((0, s.createTransferableMessage)({
                            source: t.source,
                            decrypted: i
                        }), [i.buffer])
                    })
                }
            };
        i["default"] = function(e) {
            return new o(e)
        }, t.exports = i["default"]
    }, {}],
    5: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = e(9),
                d = n(u),
                l = e(11),
                f = e(16),
                c = n(f),
                h = e(20),
                p = n(h),
                m = e(12),
                g = n(m),
                y = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                _ = n(y),
                v = e(1),
                b = n(v),
                T = e(18),
                S = n(T),
                w = e(65),
                k = e(76),
                O = n(k),
                E = e(4),
                A = n(E),
                L = e(3),
                P = n(L),
                I = e(19),
                C = e(6),
                U = undefined,
                D = {
                    videoCodec: "avc1",
                    videoObjectTypeIndicator: ".4d400d",
                    audioProfile: "2"
                }, M = ["mediaRequests", "mediaRequestsAborted", "mediaRequestsTimedout", "mediaRequestsErrored", "mediaTransferDuration", "mediaBytesTransferred"],
                R = function(e) {
                    return this.audioSegmentLoader_[e] + this.mainSegmentLoader_[e]
                }, x = function() {
                    var t = undefined;
                    try {
                        t = e.resolve("./decrypter-worker")
                    } catch (i) {}
                    return t
                }, B = function(e) {
                    return e.replace(/avc1\.(\d+)\.(\d+)/i, function(e) {
                        return (0, w.translateLegacyCodecs)([e])[0]
                    })
                };
            i.mapLegacyAvcCodecs_ = B;
            var j = function(e, t, i) {
                return e + "/" + t + '; codecs="' + i.filter(function(e) {
                    return !!e
                }).join(", ") + '"'
            }, N = function(e) {
                return e.segments && e.segments.length && e.segments[0].map ? "mp4" : "mp2t"
            }, F = function(e) {
                var t = e.attributes || {};
                return t.CODECS ? (0, I.parseCodecs)(t.CODECS) : D
            }, q = function(e, t) {
                var i = N(t),
                    n = F(t),
                    r = t.attributes || {}, a = !0,
                    s = !1;
                if (!t) return [];
                if (e.mediaGroups.AUDIO && r.AUDIO) {
                    var o = e.mediaGroups.AUDIO[r.AUDIO];
                    if (o) {
                        s = !0, a = !1;
                        for (var u in o) if (!o[u].uri) {
                            a = !0;
                            break
                        }
                    }
                }
                s && !n.audioProfile && (_["default"].log.warn("Multiple audio tracks present but no audio codec string is specified. Attempting to use the default audio codec (mp4a.40.2)"), n.audioProfile = D.audioProfile);
                var d = {};
                n.videoCodec && (d.video = "" + n.videoCodec + n.videoObjectTypeIndicator), n.audioProfile && (d.audio = "mp4a.40." + n.audioProfile);
                var l = j("audio", i, [d.audio]),
                    f = j("video", i, [d.video]),
                    c = j("video", i, [d.video, d.audio]);
                return s ? !a && d.video ? [f, l] : [c, l] : d.video ? [c] : [l]
            };
            i.mimeTypesForPlaylist_ = q;
            var G = function(e) {
                function t(e) {
                    var i = this;
                    r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this);
                    var n = e.url,
                        a = e.withCredentials,
                        s = e.mode,
                        u = e.tech,
                        l = e.bandwidth,
                        f = e.externHls,
                        h = e.useCueTags,
                        m = e.blacklistDuration,
                        g = e.enableLowInitialPlaylist;
                    if (!n) throw new Error("A non-empty playlist URL is required");
                    U = f, this.withCredentials = a, this.tech_ = u, this.hls_ = u.hls, this.mode_ = s, this.useCueTags_ = h, this.blacklistDuration = m, this.enableLowInitialPlaylist = g, this.useCueTags_ && (this.cueTagsTrack_ = this.tech_.addTextTrack("metadata", "ad-cues"), this.cueTagsTrack_.inBandMetadataTrackDispatchType = ""), this.requestOptions_ = {
                        withCredentials: this.withCredentials,
                        timeout: null
                    }, this.mediaTypes_ = (0, C.createMediaTypes)(), this.mediaSource = new _["default"].MediaSource({
                        mode: s
                    }), this.mediaSource.addEventListener("sourceopen", this.handleSourceOpen_.bind(this)), this.seekable_ = _["default"].createTimeRanges(), this.hasPlayed_ = function() {
                        return !1
                    }, this.syncController_ = new S["default"](e), this.segmentMetadataTrack_ = u.addRemoteTextTrack({
                        kind: "metadata",
                        label: "segment-metadata"
                    }, !1).track, this.decrypter_ = (0, O["default"])(A["default"], x());
                    var y = {
                        hls: this.hls_,
                        mediaSource: this.mediaSource,
                        currentTime: this.tech_.currentTime.bind(this.tech_),
                        seekable: function() {
                            return i.seekable()
                        },
                        seeking: function() {
                            return i.tech_.seeking()
                        },
                        duration: function() {
                            return i.mediaSource.duration
                        },
                        hasPlayed: function() {
                            return i.hasPlayed_()
                        },
                        goalBufferLength: function() {
                            return i.goalBufferLength()
                        },
                        bandwidth: l,
                        syncController: this.syncController_,
                        decrypter: this.decrypter_
                    };
                    this.masterPlaylistLoader_ = new d["default"](n, this.hls_, this.withCredentials), this.setupMasterPlaylistLoaderListeners_(), this.mainSegmentLoader_ = new c["default"](_["default"].mergeOptions(y, {
                        segmentMetadataTrack: this.segmentMetadataTrack_,
                        loaderType: "main"
                    }), e), this.audioSegmentLoader_ = new c["default"](_["default"].mergeOptions(y, {
                        loaderType: "audio"
                    }), e), this.subtitleSegmentLoader_ = new p["default"](_["default"].mergeOptions(y, {
                        loaderType: "vtt"
                    }), e), this.setupSegmentLoaderListeners_(), M.forEach(function(e) {
                        i[e + "_"] = R.bind(i, e)
                    }), this.masterPlaylistLoader_.load()
                }
                return a(t, e), s(t, [{
                    key: "setupMasterPlaylistLoaderListeners_",
                    value: function() {
                        var e = this;
                        this.masterPlaylistLoader_.on("loadedmetadata", function() {
                            var t = e.masterPlaylistLoader_.media(),
                                i = 1.5 * e.masterPlaylistLoader_.targetDuration * 1e3;
                            (0, l.isLowestEnabledRendition)(e.masterPlaylistLoader_.master, e.masterPlaylistLoader_.media()) ? e.requestOptions_.timeout = 0 : e.requestOptions_.timeout = i, t.endList && "none" !== e.tech_.preload() && (e.mainSegmentLoader_.playlist(t, e.requestOptions_), e.mainSegmentLoader_.load()), (0, C.setupMediaGroups)({
                                segmentLoaders: {
                                    AUDIO: e.audioSegmentLoader_,
                                    SUBTITLES: e.subtitleSegmentLoader_,
                                    main: e.mainSegmentLoader_
                                },
                                tech: e.tech_,
                                requestOptions: e.requestOptions_,
                                masterPlaylistLoader: e.masterPlaylistLoader_,
                                mode: e.mode_,
                                hls: e.hls_,
                                master: e.master(),
                                mediaTypes: e.mediaTypes_,
                                blacklistCurrentPlaylist: e.blacklistCurrentPlaylist.bind(e)
                            }), e.triggerPresenceUsage_(e.master(), t);
                            try {
                                e.setupSourceBuffers_()
                            } catch (n) {
                                return _["default"].log.warn("Failed to create SourceBuffers", n), e.mediaSource.endOfStream("decode")
                            }
                            e.setupFirstPlay(), e.trigger("selectedinitialmedia")
                        }), this.masterPlaylistLoader_.on("loadedplaylist", function() {
                            var t = e.masterPlaylistLoader_.media();
                            if (!t) {
                                var i = undefined;
                                return e.enableLowInitialPlaylist && (i = e.selectInitialPlaylist()), i || (i = e.selectPlaylist()), e.initialMedia_ = i, void e.masterPlaylistLoader_.media(e.initialMedia_)
                            }
                            e.useCueTags_ && e.updateAdCues_(t), e.mainSegmentLoader_.playlist(t, e.requestOptions_), e.updateDuration(), e.tech_.paused() || e.mainSegmentLoader_.load(), t.endList || function() {
                                var t = function() {
                                    var t = e.seekable();
                                    0 !== t.length && e.mediaSource.addSeekableRange_(t.start(0), t.end(0))
                                };
                                e.duration() !== Infinity ? function() {
                                    var i = function n() {
                                        e.duration() === Infinity ? t() : e.tech_.one("durationchange", n)
                                    };
                                    e.tech_.one("durationchange", i)
                                }() : t()
                            }()
                        }), this.masterPlaylistLoader_.on("error", function() {
                            e.blacklistCurrentPlaylist(e.masterPlaylistLoader_.error)
                        }), this.masterPlaylistLoader_.on("mediachanging", function() {
                            e.mainSegmentLoader_.abort(), e.mainSegmentLoader_.pause()
                        }), this.masterPlaylistLoader_.on("mediachange", function() {
                            var t = e.masterPlaylistLoader_.media(),
                                i = 1.5 * e.masterPlaylistLoader_.targetDuration * 1e3;
                            (0, l.isLowestEnabledRendition)(e.masterPlaylistLoader_.master, e.masterPlaylistLoader_.media()) ? e.requestOptions_.timeout = 0 : e.requestOptions_.timeout = i, e.mainSegmentLoader_.playlist(t, e.requestOptions_), e.mainSegmentLoader_.load(), e.tech_.trigger({
                                type: "mediachange",
                                bubbles: !0
                            })
                        }), this.masterPlaylistLoader_.on("playlistunchanged", function() {
                            var t = e.masterPlaylistLoader_.media();
                            e.stuckAtPlaylistEnd_(t) && (e.blacklistCurrentPlaylist({
                                message: "Playlist no longer updating."
                            }), e.tech_.trigger("playliststuck"))
                        }), this.masterPlaylistLoader_.on("renditiondisabled", function() {
                            e.tech_.trigger({
                                type: "usage",
                                name: "hls-rendition-disabled"
                            })
                        }), this.masterPlaylistLoader_.on("renditionenabled", function() {
                            e.tech_.trigger({
                                type: "usage",
                                name: "hls-rendition-enabled"
                            })
                        })
                    }
                }, {
                    key: "triggerPresenceUsage_",
                    value: function(e, t) {
                        var i = e.mediaGroups || {}, n = !0,
                            r = Object.keys(i.AUDIO);
                        for (var a in i.AUDIO) for (var s in i.AUDIO[a]) {
                            var o = i.AUDIO[a][s];
                            o.uri || (n = !1)
                        }
                        n && this.tech_.trigger({
                            type: "usage",
                            name: "hls-demuxed"
                        }), Object.keys(i.SUBTITLES).length && this.tech_.trigger({
                            type: "usage",
                            name: "hls-webvtt"
                        }), U.Playlist.isAes(t) && this.tech_.trigger({
                            type: "usage",
                            name: "hls-aes"
                        }), U.Playlist.isFmp4(t) && this.tech_.trigger({
                            type: "usage",
                            name: "hls-fmp4"
                        }), r.length && Object.keys(i.AUDIO[r[0]]).length > 1 && this.tech_.trigger({
                            type: "usage",
                            name: "hls-alternate-audio"
                        }), this.useCueTags_ && this.tech_.trigger({
                            type: "usage",
                            name: "hls-playlist-cue-tags"
                        })
                    }
                }, {
                    key: "setupSegmentLoaderListeners_",
                    value: function() {
                        var e = this;
                        this.mainSegmentLoader_.on("bandwidthupdate", function() {
                            var t = e.selectPlaylist(),
                                i = e.masterPlaylistLoader_.media(),
                                n = e.tech_.buffered(),
                                r = n.length ? n.end(n.length - 1) - e.tech_.currentTime() : 0,
                                a = e.bufferLowWaterLine();
                            (!i.endList || e.duration() < P["default"].MAX_BUFFER_LOW_WATER_LINE || t.attributes.BANDWIDTH < i.attributes.BANDWIDTH || r >= a) && e.masterPlaylistLoader_.media(t), e.tech_.trigger("bandwidthupdate")
                        }), this.mainSegmentLoader_.on("progress", function() {
                            e.trigger("progress")
                        }), this.mainSegmentLoader_.on("error", function() {
                            e.blacklistCurrentPlaylist(e.mainSegmentLoader_.error())
                        }), this.mainSegmentLoader_.on("syncinfoupdate", function() {
                            e.onSyncInfoUpdate_()
                        }), this.mainSegmentLoader_.on("timestampoffset", function() {
                            e.tech_.trigger({
                                type: "usage",
                                name: "hls-timestamp-offset"
                            })
                        }), this.audioSegmentLoader_.on("syncinfoupdate", function() {
                            e.onSyncInfoUpdate_()
                        }), this.mainSegmentLoader_.on("ended", function() {
                            e.onEndOfStream()
                        }), this.mainSegmentLoader_.on("earlyabort", function() {
                            e.blacklistCurrentPlaylist({
                                message: "Aborted early because there isn't enough bandwidth to complete the request without rebuffering."
                            }, 120)
                        }), this.mainSegmentLoader_.on("reseteverything", function() {
                            e.tech_.trigger("hls-reset")
                        }), this.mainSegmentLoader_.on("segmenttimemapping", function(t) {
                            e.tech_.trigger({
                                type: "hls-segment-time-mapping",
                                mapping: t.mapping
                            })
                        }), this.audioSegmentLoader_.on("ended", function() {
                            e.onEndOfStream()
                        })
                    }
                }, {
                    key: "mediaSecondsLoaded_",
                    value: function() {
                        return Math.max(this.audioSegmentLoader_.mediaSecondsLoaded + this.mainSegmentLoader_.mediaSecondsLoaded)
                    }
                }, {
                    key: "load",
                    value: function() {
                        this.mainSegmentLoader_.load(), this.mediaTypes_.AUDIO.activePlaylistLoader && this.audioSegmentLoader_.load(), this.mediaTypes_.SUBTITLES.activePlaylistLoader && this.subtitleSegmentLoader_.load()
                    }
                }, {
                    key: "fastQualityChange_",
                    value: function() {
                        var e = this.selectPlaylist();
                        e !== this.masterPlaylistLoader_.media() && (this.masterPlaylistLoader_.media(e), this.mainSegmentLoader_.resetLoader())
                    }
                }, {
                    key: "play",
                    value: function() {
                        if (!this.setupFirstPlay()) {
                            this.tech_.ended() && this.tech_.setCurrentTime(0), this.hasPlayed_() && this.load();
                            var e = this.tech_.seekable();
                            return this.tech_.duration() === Infinity && this.tech_.currentTime() < e.start(0) ? this.tech_.setCurrentTime(e.end(e.length - 1)) : void 0
                        }
                    }
                }, {
                    key: "setupFirstPlay",
                    value: function() {
                        var e = this,
                            t = this.masterPlaylistLoader_.media();
                        if (!t || this.tech_.paused() || this.hasPlayed_()) return !1;
                        if (!t.endList) {
                            var i = function() {
                                var t = e.seekable();
                                return t.length ? _["default"].browser.IE_VERSION && "html5" === e.mode_ && 0 === e.tech_.readyState() ? (e.tech_.one("loadedmetadata", function() {
                                    e.trigger("firstplay"), e.tech_.setCurrentTime(t.end(0)), e.hasPlayed_ = function() {
                                        return !0
                                    }
                                }), {
                                    v: !1
                                }) : (e.trigger("firstplay"), void e.tech_.setCurrentTime(t.end(0))) : {
                                    v: !1
                                }
                            }();
                            if ("object" == typeof i) return i.v
                        }
                        return this.hasPlayed_ = function() {
                            return !0
                        }, this.load(), !0
                    }
                }, {
                    key: "handleSourceOpen_",
                    value: function() {
                        try {
                            this.setupSourceBuffers_()
                        } catch (t) {
                            return _["default"].log.warn("Failed to create Source Buffers", t), this.mediaSource.endOfStream("decode")
                        }
                        if (this.tech_.autoplay()) {
                            var e = this.tech_.play();
                            void 0 !== e && "function" == typeof e.then && e.then(null, function(e) {})
                        }
                        this.trigger("sourceopen")
                    }
                }, {
                    key: "onEndOfStream",
                    value: function() {
                        var e = this.mainSegmentLoader_.ended_;
                        this.mediaTypes_.AUDIO.activePlaylistLoader && (e = e && this.audioSegmentLoader_.ended_), e && this.mediaSource.endOfStream()
                    }
                }, {
                    key: "stuckAtPlaylistEnd_",
                    value: function(e) {
                        if (!this.seekable().length) return !1;
                        var t = this.syncController_.getExpiredTime(e, this.mediaSource.duration);
                        if (null === t) return !1;
                        var i = U.Playlist.playlistEnd(e, t),
                            n = this.tech_.currentTime(),
                            r = this.tech_.buffered();
                        if (!r.length) return i - n <= g["default"].SAFE_TIME_DELTA;
                        var a = r.end(r.length - 1);
                        return a - n <= g["default"].SAFE_TIME_DELTA && i - a <= g["default"].SAFE_TIME_DELTA
                    }
                }, {
                    key: "blacklistCurrentPlaylist",
                    value: function(e, t) {
                        e === undefined && (e = {});
                        var i = undefined,
                            n = undefined;
                        if (i = e.playlist || this.masterPlaylistLoader_.media(), t = t || e.blacklistDuration || this.blacklistDuration, !i) {
                            this.error = e;
                            try {
                                return this.mediaSource.endOfStream("network")
                            } catch (a) {
                                return this.trigger("error")
                            }
                        }
                        var r = 1 === this.masterPlaylistLoader_.master.playlists.filter(l.isEnabled).length;
                        return r ? (_["default"].log.warn("Problem encountered with the current HLS playlist. Trying again since it is the final playlist."), this.tech_.trigger("retryplaylist"), this.masterPlaylistLoader_.load(r)) : (i.excludeUntil = Date.now() + 1e3 * t, this.tech_.trigger("blacklistplaylist"), this.tech_.trigger({
                            type: "usage",
                            name: "hls-rendition-blacklisted"
                        }), n = this.selectPlaylist(), _["default"].log.warn("Problem encountered with the current HLS playlist." + (e.message ? " " + e.message : "") + " Switching to another playlist."), this.masterPlaylistLoader_.media(n))
                    }
                }, {
                    key: "pauseLoading",
                    value: function() {
                        this.mainSegmentLoader_.pause(), this.mediaTypes_.AUDIO.activePlaylistLoader && this.audioSegmentLoader_.pause(), this.mediaTypes_.SUBTITLES.activePlaylistLoader && this.subtitleSegmentLoader_.pause()
                    }
                }, {
                    key: "setCurrentTime",
                    value: function(e) {
                        var t = g["default"].findRange(this.tech_.buffered(), e);
                        return this.masterPlaylistLoader_ && this.masterPlaylistLoader_.media() && this.masterPlaylistLoader_.media().segments ? t && t.length && "flash" !== this.mode_ ? e : (this.mainSegmentLoader_.resetEverything(), this.mainSegmentLoader_.abort(), this.mediaTypes_.AUDIO.activePlaylistLoader && (this.audioSegmentLoader_.resetEverything(), this.audioSegmentLoader_.abort()), this.mediaTypes_.SUBTITLES.activePlaylistLoader && (this.subtitleSegmentLoader_.resetEverything(), this.subtitleSegmentLoader_.abort()), void this.load()) : 0
                    }
                }, {
                    key: "duration",
                    value: function() {
                        return this.masterPlaylistLoader_ ? this.mediaSource ? this.mediaSource.duration : U.Playlist.duration(this.masterPlaylistLoader_.media()) : 0
                    }
                }, {
                    key: "seekable",
                    value: function() {
                        return this.seekable_
                    }
                }, {
                    key: "onSyncInfoUpdate_",
                    value: function() {
                        var e = undefined,
                            t = undefined;
                        if (this.masterPlaylistLoader_) {
                            var i = this.masterPlaylistLoader_.media();
                            if (i) {
                                var n = this.syncController_.getExpiredTime(i, this.mediaSource.duration);
                                if (null !== n && (e = U.Playlist.seekable(i, n), 0 !== e.length)) {
                                    if (this.mediaTypes_.AUDIO.activePlaylistLoader) {
                                        if (i = this.mediaTypes_.AUDIO.activePlaylistLoader.media(), null === (n = this.syncController_.getExpiredTime(i, this.mediaSource.duration))) return;
                                        if (t = U.Playlist.seekable(i, n), 0 === t.length) return
                                    }
                                    t ? t.start(0) > e.end(0) || e.start(0) > t.end(0) ? this.seekable_ = e : this.seekable_ = _["default"].createTimeRanges([
                                        [t.start(0) > e.start(0) ? t.start(0) : e.start(0), t.end(0) < e.end(0) ? t.end(0) : e.end(0)]
                                    ]) : this.seekable_ = e, this.tech_.trigger("seekablechanged")
                                }
                            }
                        }
                    }
                }, {
                    key: "updateDuration",
                    value: function() {
                        var e = this,
                            t = this.mediaSource.duration,
                            i = U.Playlist.duration(this.masterPlaylistLoader_.media()),
                            n = this.tech_.buffered(),
                            r = function a() {
                                e.mediaSource.duration = i, e.tech_.trigger("durationchange"), e.mediaSource.removeEventListener("sourceopen", a)
                            };
                        n.length > 0 && (i = Math.max(i, n.end(n.length - 1))), t !== i && ("open" !== this.mediaSource.readyState ? this.mediaSource.addEventListener("sourceopen", r) : r())
                    }
                }, {
                    key: "dispose",
                    value: function() {
                        var e = this;
                        this.decrypter_.terminate(), this.masterPlaylistLoader_.dispose(), this.mainSegmentLoader_.dispose(), ["AUDIO", "SUBTITLES"].forEach(function(t) {
                            var i = e.mediaTypes_[t].groups;
                            for (var n in i) i[n].forEach(function(e) {
                                e.playlistLoader && e.playlistLoader.dispose()
                            })
                        }), this.audioSegmentLoader_.dispose(), this.subtitleSegmentLoader_.dispose()
                    }
                }, {
                    key: "master",
                    value: function() {
                        return this.masterPlaylistLoader_.master
                    }
                }, {
                    key: "media",
                    value: function() {
                        return this.masterPlaylistLoader_.media() || this.initialMedia_
                    }
                }, {
                    key: "setupSourceBuffers_",
                    value: function() {
                        var e = this.masterPlaylistLoader_.media(),
                            t = undefined;
                        if (e && "open" === this.mediaSource.readyState) {
                            if (t = q(this.masterPlaylistLoader_.master, e), t.length < 1) return this.error = "No compatible SourceBuffer configuration for the variant stream:" + e.resolvedUri, this.mediaSource.endOfStream("decode");
                            this.mainSegmentLoader_.mimeType(t[0]), t[1] && this.audioSegmentLoader_.mimeType(t[1]), this.excludeIncompatibleVariants_(e)
                        }
                    }
                }, {
                    key: "excludeIncompatibleVariants_",
                    value: function(e) {
                        var t = this.masterPlaylistLoader_.master,
                            i = 2,
                            n = null,
                            r = undefined;
                        e.attributes.CODECS && (r = (0, I.parseCodecs)(e.attributes.CODECS), n = r.videoCodec, i = r.codecCount), t.playlists.forEach(function(e) {
                            var t = {
                                codecCount: 2,
                                videoCodec: null
                            };
                            if (e.attributes.CODECS) {
                                var r = e.attributes.CODECS;
                                t = (0, I.parseCodecs)(r), window.MediaSource && window.MediaSource.isTypeSupported && !window.MediaSource.isTypeSupported('video/mp4; codecs="' + B(r) + '"') && (e.excludeUntil = Infinity)
                            }
                            t.codecCount !== i && (e.excludeUntil = Infinity), t.videoCodec !== n && (e.excludeUntil = Infinity)
                        })
                    }
                }, {
                    key: "updateAdCues_",
                    value: function(e) {
                        var t = 0,
                            i = this.seekable();
                        i.length && (t = i.start(0)), b["default"].updateAdCues(e, this.cueTagsTrack_, t)
                    }
                }, {
                    key: "goalBufferLength",
                    value: function() {
                        var e = this.tech_.currentTime(),
                            t = P["default"].GOAL_BUFFER_LENGTH,
                            i = P["default"].GOAL_BUFFER_LENGTH_RATE,
                            n = Math.max(t, P["default"].MAX_GOAL_BUFFER_LENGTH);
                        return Math.min(t + e * i, n)
                    }
                }, {
                    key: "bufferLowWaterLine",
                    value: function() {
                        var e = this.tech_.currentTime(),
                            t = P["default"].BUFFER_LOW_WATER_LINE,
                            i = P["default"].BUFFER_LOW_WATER_LINE_RATE,
                            n = Math.max(t, P["default"].MAX_BUFFER_LOW_WATER_LINE);
                        return Math.min(t + e * i, n)
                    }
                }]), t
            }(_["default"].EventTarget);
            i.MasterPlaylistController = G
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    6: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var r = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                a = n(r),
                s = e(9),
                o = n(s),
                u = function() {}, d = function(e) {
                    var t = e["default"] ? "main" : "alternative";
                    return e.characteristics && e.characteristics.indexOf("public.accessibility.describes-video") >= 0 && (t = "main-desc"), t
                }, l = function(e, t) {
                    e.abort(), e.pause(), t && t.activePlaylistLoader && (t.activePlaylistLoader.pause(), t.activePlaylistLoader = null)
                };
            i.stopLoaders = l;
            var f = function(e, t) {
                t.activePlaylistLoader = e, e.load()
            };
            i.startLoaders = f;
            var c = function(e, t) {
                return function() {
                    var i = t.segmentLoaders,
                        n = i[e],
                        r = i.main,
                        a = t.mediaTypes[e],
                        s = a.activeTrack(),
                        o = a.activeGroup(s),
                        u = a.activePlaylistLoader;
                    if (l(n, a), o) {
                        if (!o.playlistLoader) return void(u && r.resetEverything());
                        n.resyncLoader(), f(o.playlistLoader, a)
                    }
                }
            };
            i.onGroupChanged = c;
            var h = function(e, t) {
                return function() {
                    var i = t.segmentLoaders,
                        n = i[e],
                        r = i.main,
                        a = t.mediaTypes[e],
                        s = a.activeTrack(),
                        o = a.activeGroup(s),
                        u = a.activePlaylistLoader;
                    if (l(n, a), o) {
                        if (!o.playlistLoader) return void r.resetEverything();
                        if (u === o.playlistLoader) return void f(o.playlistLoader, a);
                        n.track && n.track(s), n.resetEverything(), f(o.playlistLoader, a)
                    }
                }
            };
            i.onTrackChanged = h;
            var p = {
                AUDIO: function(e, t) {
                    return function() {
                        var i = t.segmentLoaders[e],
                            n = t.mediaTypes[e],
                            r = t.blacklistCurrentPlaylist;
                        l(i, n);
                        var s = n.activeTrack(),
                            o = n.activeGroup(),
                            u = (o.filter(function(e) {
                                return e["default"]
                            })[0] || o[0]).id,
                            d = n.tracks[u];
                        if (s === d) return void r({
                            message: "Problem encountered loading the default audio track."
                        });
                        a["default"].log.warn("Problem encountered loading the alternate audio track.Switching back to default.");
                        for (var f in n.tracks) n.tracks[f].enabled = n.tracks[f] === d;
                        n.onTrackChanged()
                    }
                },
                SUBTITLES: function(e, t) {
                    return function() {
                        var i = t.segmentLoaders[e],
                            n = t.mediaTypes[e];
                        a["default"].log.warn("Problem encountered loading the subtitle track.Disabling subtitle track."), l(i, n);
                        var r = n.activeTrack();
                        r && (r.mode = "disabled"), n.onTrackChanged()
                    }
                }
            };
            i.onError = p;
            var m = {
                AUDIO: function(e, t, i) {
                    if (t) {
                        var n = i.tech,
                            r = i.requestOptions,
                            a = i.segmentLoaders[e];
                        t.on("loadedmetadata", function() {
                            var e = t.media();
                            a.playlist(e, r), (!n.paused() || e.endList && "none" !== n.preload()) && a.load()
                        }), t.on("loadedplaylist", function() {
                            a.playlist(t.media(), r), n.paused() || a.load()
                        }), t.on("error", p[e](e, i))
                    }
                },
                SUBTITLES: function(e, t, i) {
                    var n = i.tech,
                        r = i.requestOptions,
                        a = i.segmentLoaders[e],
                        s = i.mediaTypes[e];
                    t.on("loadedmetadata", function() {
                        var e = t.media();
                        a.playlist(e, r), a.track(s.activeTrack()), (!n.paused() || e.endList && "none" !== n.preload()) && a.load()
                    }), t.on("loadedplaylist", function() {
                        a.playlist(t.media(), r), n.paused() || a.load()
                    }), t.on("error", p[e](e, i))
                }
            };
            i.setupListeners = m;
            var g = {
                AUDIO: function(e, t) {
                    var i = t.mode,
                        n = t.hls,
                        r = t.segmentLoaders[e],
                        s = t.requestOptions.withCredentials,
                        u = t.master.mediaGroups,
                        l = t.mediaTypes[e],
                        f = l.groups,
                        c = l.tracks;
                    u[e] && 0 !== Object.keys(u[e]).length && "html5" === i || (u[e] = {
                        main: {
                            "default": {
                                "default": !0
                            }
                        }
                    });
                    for (var h in u[e]) {
                        f[h] || (f[h] = []);
                        for (var g in u[e][h]) {
                            var y = u[e][h][g],
                                _ = undefined;
                            if (_ = y.resolvedUri ? new o["default"](y.resolvedUri, n, s) : null, y = a["default"].mergeOptions({
                                id: g,
                                playlistLoader: _
                            }, y), m[e](e, y.playlistLoader, t), f[h].push(y), "undefined" == typeof c[g]) {
                                var v = new a["default"].AudioTrack({
                                    id: g,
                                    kind: d(y),
                                    enabled: !1,
                                    language: y.language,
                                    "default": y["default"],
                                    label: g
                                });
                                c[g] = v
                            }
                        }
                    }
                    r.on("error", p[e](e, t))
                },
                SUBTITLES: function(e, t) {
                    var i = t.tech,
                        n = t.hls,
                        r = t.segmentLoaders[e],
                        s = t.requestOptions.withCredentials,
                        u = t.master.mediaGroups,
                        d = t.mediaTypes[e],
                        l = d.groups,
                        f = d.tracks;
                    for (var c in u[e]) {
                        l[c] || (l[c] = []);
                        for (var h in u[e][c]) if (!u[e][c][h].forced) {
                            var g = u[e][c][h];
                            if (g = a["default"].mergeOptions({
                                id: h,
                                playlistLoader: new o["default"](g.resolvedUri, n, s)
                            }, g), m[e](e, g.playlistLoader, t), l[c].push(g), "undefined" == typeof f[h]) {
                                var y = i.addRemoteTextTrack({
                                    id: h,
                                    kind: "subtitles",
                                    enabled: !1,
                                    language: g.language,
                                    label: h
                                }, !1).track;
                                f[h] = y
                            }
                        }
                    }
                    r.on("error", p[e](e, t))
                },
                "CLOSED-CAPTIONS": function(e, t) {
                    var i = t.tech,
                        n = t.master.mediaGroups,
                        r = t.mediaTypes[e],
                        s = r.groups,
                        o = r.tracks;
                    for (var u in n[e]) {
                        s[u] || (s[u] = []);
                        for (var d in n[e][u]) {
                            var l = n[e][u][d];
                            if (l.instreamId.match(/CC\d/) && (s[u].push(a["default"].mergeOptions({
                                id: d
                            }, l)), "undefined" == typeof o[d])) {
                                var f = i.addRemoteTextTrack({
                                    id: l.instreamId,
                                    kind: "captions",
                                    enabled: !1,
                                    language: l.language,
                                    label: d
                                }, !1).track;
                                o[d] = f
                            }
                        }
                    }
                }
            };
            i.initialize = g;
            var y = function(e, t) {
                return function(i) {
                    var n = t.masterPlaylistLoader,
                        r = t.mediaTypes[e].groups,
                        a = n.media();
                    if (!a) return null;
                    var s = null;
                    return a.attributes[e] && (s = r[a.attributes[e]]), s = s || r.main, void 0 === i ? s : null === i ? null : s.filter(function(e) {
                        return e.id === i.id
                    })[0] || null
                }
            };
            i.activeGroup = y;
            var _ = {
                AUDIO: function(e, t) {
                    return function() {
                        var i = t.mediaTypes[e].tracks;
                        for (var n in i) if (i[n].enabled) return i[n];
                        return null
                    }
                },
                SUBTITLES: function(e, t) {
                    return function() {
                        var i = t.mediaTypes[e].tracks;
                        for (var n in i) if ("showing" === i[n].mode) return i[n];
                        return null
                    }
                }
            };
            i.activeTrack = _;
            var v = function(e) {
                ["AUDIO", "SUBTITLES", "CLOSED-CAPTIONS"].forEach(function(t) {
                    g[t](t, e)
                });
                var t = e.mediaTypes,
                    i = e.masterPlaylistLoader,
                    n = e.tech,
                    r = e.hls;
                ["AUDIO", "SUBTITLES"].forEach(function(i) {
                    t[i].activeGroup = y(i, e), t[i].activeTrack = _[i](i, e), t[i].onGroupChanged = c(i, e), t[i].onTrackChanged = h(i, e)
                });
                var a = t.AUDIO.activeGroup(),
                    s = (a.filter(function(e) {
                        return e["default"]
                    })[0] || a[0]).id;
                t.AUDIO.tracks[s].enabled = !0, t.AUDIO.onTrackChanged(), i.on("mediachange", function() {
                    ["AUDIO", "SUBTITLES"].forEach(function(e) {
                        return t[e].onGroupChanged()
                    })
                });
                var o = function() {
                    t.AUDIO.onTrackChanged(), n.trigger({
                        type: "usage",
                        name: "hls-audio-change"
                    })
                };
                n.audioTracks().addEventListener("change", o), n.remoteTextTracks().addEventListener("change", t.SUBTITLES.onTrackChanged), r.on("dispose", function() {
                    n.audioTracks().removeEventListener("change", o), n.remoteTextTracks().removeEventListener("change", t.SUBTITLES.onTrackChanged)
                }), n.clearTracks("audio");
                for (var u in t.AUDIO.tracks) n.audioTracks().addTrack(t.AUDIO.tracks[u])
            };
            i.setupMediaGroups = v;
            var b = function() {
                var e = {};
                return ["AUDIO", "SUBTITLES", "CLOSED-CAPTIONS"].forEach(function(t) {
                    e[t] = {
                        groups: {},
                        tracks: {},
                        activePlaylistLoader: null,
                        activeGroup: u,
                        activeTrack: u,
                        onGroupChanged: u,
                        onTrackChanged: u
                    }
                }), e
            };
            i.createMediaTypes = b
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    7: [function(e, t, i) {
        (function(t) {
            "use strict";
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                r = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(n),
                a = e(2),
                s = {
                    FAILURE: 2,
                    TIMEOUT: -101,
                    ABORTED: -102
                };
            i.REQUEST_ERRORS = s;
            var o = function(e) {
                var t = (undefined, undefined);
                return t = e.offset + e.length - 1, "bytes=" + e.offset + "-" + t
            }, u = function(e) {
                var t = {};
                return e.byterange && (t.Range = o(e.byterange)), t
            }, d = function(e) {
                e.forEach(function(e) {
                    e.abort()
                })
            }, l = function(e) {
                return {
                    bandwidth: e.bandwidth,
                    bytesReceived: e.bytesReceived || 0,
                    roundTripTime: e.roundTripTime || 0
                }
            }, f = function(e) {
                var t = e.target,
                    i = Date.now() - t.requestTime,
                    n = {
                        bandwidth: Infinity,
                        bytesReceived: 0,
                        roundTripTime: i || 0
                    };
                return n.bytesReceived = e.loaded, n.bandwidth = Math.floor(n.bytesReceived / n.roundTripTime * 8 * 1e3), n
            }, c = function(e, t) {
                return t.timedout ? {
                    status: t.status,
                    message: "HLS request timed-out at URL: " + t.uri,
                    code: s.TIMEOUT,
                    xhr: t
                } : t.aborted ? {
                    status: t.status,
                    message: "HLS request aborted at URL: " + t.uri,
                    code: s.ABORTED,
                    xhr: t
                } : e ? {
                    status: t.status,
                    message: "HLS request errored at URL: " + t.uri,
                    code: s.FAILURE,
                    xhr: t
                } : null
            }, h = function(e, t) {
                return function(i, n) {
                    var r = n.response,
                        a = c(i, n);
                    if (a) return t(a, e);
                    if (16 !== r.byteLength) return t({
                        status: n.status,
                        message: "Invalid HLS key at URL: " + n.uri,
                        code: s.FAILURE,
                        xhr: n
                    }, e);
                    var o = new DataView(r);
                    return e.key.bytes = new Uint32Array([o.getUint32(0), o.getUint32(4), o.getUint32(8), o.getUint32(12)]), t(null, e)
                }
            }, p = function(e, t) {
                return function(i, n) {
                    var r = n.response,
                        a = c(i, n);
                    return a ? t(a, e) : 0 === r.byteLength ? t({
                        status: n.status,
                        message: "Empty HLS segment content at URL: " + n.uri,
                        code: s.FAILURE,
                        xhr: n
                    }, e) : (e.map.bytes = new Uint8Array(n.response), t(null, e))
                }
            }, m = function(e, t) {
                return function(i, n) {
                    var r = n.response,
                        a = c(i, n);
                    return a ? t(a, e) : 0 === r.byteLength ? t({
                        status: n.status,
                        message: "Empty HLS segment content at URL: " + n.uri,
                        code: s.FAILURE,
                        xhr: n
                    }, e) : (e.stats = l(n), e.key ? e.encryptedBytes = new Uint8Array(n.response) : e.bytes = new Uint8Array(n.response), t(null, e))
                }
            }, g = function(e, t, i) {
                var n = function r(n) {
                    if (n.data.source === t.requestId) {
                        e.removeEventListener("message", r);
                        var a = n.data.decrypted;
                        return t.bytes = new Uint8Array(a.bytes, a.byteOffset, a.byteLength), i(null, t)
                    }
                };
                e.addEventListener("message", n), e.postMessage((0, a.createTransferableMessage)({
                    source: t.requestId,
                    encrypted: t.encryptedBytes,
                    key: t.key.bytes,
                    iv: t.key.iv
                }), [t.encryptedBytes.buffer, t.key.bytes.buffer])
            }, y = function(e) {
                return e.reduce(function(e, t) {
                    return t.code > e.code ? t : e
                })
            }, _ = function(e, t, i) {
                var n = [],
                    r = 0;
                return function(a, s) {
                    if (a && (d(e), n.push(a)), (r += 1) === e.length) {
                        if (s.endOfAllRequests = Date.now(), n.length > 0) {
                            var o = y(n);
                            return i(o, s)
                        }
                        return s.encryptedBytes ? g(t, s, i) : i(null, s)
                    }
                }
            }, v = function(e, t) {
                return function(i) {
                    return e.stats = r["default"].mergeOptions(e.stats, f(i)), !e.stats.firstBytesReceivedAt && e.stats.bytesReceived && (e.stats.firstBytesReceivedAt = Date.now()), t(i, e)
                }
            }, b = function(e, t, i, n, a, s) {
                var o = [],
                    l = _(o, i, s);
                if (n.key) {
                    var f = r["default"].mergeOptions(t, {
                            uri: n.key.resolvedUri,
                            responseType: "arraybuffer"
                        }),
                        c = h(n, l),
                        g = e(f, c);
                    o.push(g)
                }
                if (n.map && !n.map.bytes) {
                    var y = r["default"].mergeOptions(t, {
                            uri: n.map.resolvedUri,
                            responseType: "arraybuffer",
                            headers: u(n.map)
                        }),
                        b = p(n, l),
                        T = e(y, b);
                    o.push(T)
                }
                var S = r["default"].mergeOptions(t, {
                        uri: n.resolvedUri,
                        responseType: "arraybuffer",
                        headers: u(n)
                    }),
                    w = m(n, l),
                    k = e(S, w);
                return k.addEventListener("progress", v(n, a)), o.push(k),
                    function() {
                        return d(o)
                    }
            };
            i.mediaSegmentRequest = b
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    8: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = e(32),
                u = r(o),
                d = e(12),
                l = r(d),
                f = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                c = r(f),
                h = ["seeking", "seeked", "pause", "playing", "error"],
                p = function() {
                    function e(t) {
                        var i = this;
                        a(this, e), this.tech_ = t.tech, this.seekable = t.seekable, this.consecutiveUpdates = 0, this.lastRecordedTime = null, this.timer_ = null, this.checkCurrentTimeTimeout_ = null, t.debug && (this.logger_ = c["default"].log.bind(c["default"], "playback-watcher ->")), this.logger_("initialize");
                        var n = function() {
                            return i.monitorCurrentTime_()
                        }, r = function() {
                            return i.techWaiting_()
                        }, s = function() {
                            return i.cancelTimer_()
                        }, o = function() {
                            return i.fixesBadSeeks_()
                        };
                        this.tech_.on("seekablechanged", o), this.tech_.on("waiting", r), this.tech_.on(h, s), this.tech_.on("canplay", n), this.dispose = function() {
                            i.logger_("dispose"), i.tech_.off("seekablechanged", o), i.tech_.off("waiting", r), i.tech_.off(h, s), i.tech_.off("canplay", n), i.checkCurrentTimeTimeout_ && u["default"].clearTimeout(i.checkCurrentTimeTimeout_), i.cancelTimer_()
                        }
                    }
                    return s(e, [{
                        key: "monitorCurrentTime_",
                        value: function() {
                            this.checkCurrentTime_(), this.checkCurrentTimeTimeout_ && u["default"].clearTimeout(this.checkCurrentTimeTimeout_), this.checkCurrentTimeTimeout_ = u["default"].setTimeout(this.monitorCurrentTime_.bind(this), 250)
                        }
                    }, {
                        key: "checkCurrentTime_",
                        value: function() {
                            if (this.tech_.seeking() && this.fixesBadSeeks_()) return this.consecutiveUpdates = 0, void(this.lastRecordedTime = this.tech_.currentTime());
                            if (!this.tech_.paused() && !this.tech_.seeking()) {
                                var e = this.tech_.currentTime(),
                                    t = this.tech_.buffered();
                                if (this.lastRecordedTime === e && (!t.length || e + l["default"].SAFE_TIME_DELTA >= t.end(t.length - 1))) return this.techWaiting_();
                                this.consecutiveUpdates >= 5 && e === this.lastRecordedTime ? (this.consecutiveUpdates++, this.waiting_()) : e === this.lastRecordedTime ? this.consecutiveUpdates++ : (this.consecutiveUpdates = 0, this.lastRecordedTime = e)
                            }
                        }
                    }, {
                        key: "cancelTimer_",
                        value: function() {
                            this.consecutiveUpdates = 0, this.timer_ && (this.logger_("cancelTimer_"), clearTimeout(this.timer_)), this.timer_ = null
                        }
                    }, {
                        key: "fixesBadSeeks_",
                        value: function() {
                            var e = this.tech_.seeking(),
                                t = this.seekable(),
                                i = this.tech_.currentTime(),
                                n = undefined;
                            if (e && this.afterSeekableWindow_(t, i)) {
                                n = t.end(t.length - 1)
                            }
                            if (e && this.beforeSeekableWindow_(t, i)) {
                                n = t.start(0) + l["default"].SAFE_TIME_DELTA
                            }
                            return void 0 !== n && (this.logger_("Trying to seek outside of seekable at time " + i + " with seekable range " + l["default"].printableRange(t) + ". Seeking to " + n + "."), this.tech_.setCurrentTime(n), !0)
                        }
                    }, {
                        key: "waiting_",
                        value: function() {
                            if (!this.techWaiting_()) {
                                var e = this.tech_.currentTime(),
                                    t = this.tech_.buffered(),
                                    i = l["default"].findRange(t, e);
                                return i.length && e + 3 <= i.end(0) ? (this.cancelTimer_(), this.tech_.setCurrentTime(e), this.logger_("Stopped at " + e + " while inside a buffered region [" + i.start(0) + " -> " + i.end(0) + "]. Attempting to resume playback by seeking to the current time."), void this.tech_.trigger({
                                    type: "usage",
                                    name: "hls-unknown-waiting"
                                })) : void 0
                            }
                        }
                    }, {
                        key: "techWaiting_",
                        value: function() {
                            var e = this.seekable(),
                                t = this.tech_.currentTime();
                            if (this.tech_.seeking() && this.fixesBadSeeks_()) return !0;
                            if (this.tech_.seeking() || null !== this.timer_) return !0;
                            if (this.beforeSeekableWindow_(e, t)) {
                                var i = e.end(e.length - 1);
                                return this.logger_("Fell out of live window at time " + t + ". Seeking to live point (seekable end) " + i), this.cancelTimer_(), this.tech_.setCurrentTime(i), this.tech_.trigger({
                                    type: "usage",
                                    name: "hls-live-resync"
                                }), !0
                            }
                            var n = this.tech_.buffered(),
                                r = l["default"].findNextRange(n, t);
                            if (this.videoUnderflow_(r, n, t)) return this.cancelTimer_(), this.tech_.setCurrentTime(t), this.tech_.trigger({
                                type: "usage",
                                name: "hls-video-underflow"
                            }), !0;
                            if (r.length > 0) {
                                var a = r.start(0) - t;
                                return this.logger_("Stopped at " + t + ", setting timer for " + a + ", seeking to " + r.start(0)), this.timer_ = setTimeout(this.skipTheGap_.bind(this), 1e3 * a, t), !0
                            }
                            return !1
                        }
                    }, {
                        key: "afterSeekableWindow_",
                        value: function(e, t) {
                            return !!e.length && t > e.end(e.length - 1) + l["default"].SAFE_TIME_DELTA
                        }
                    }, {
                        key: "beforeSeekableWindow_",
                        value: function(e, t) {
                            return !!(e.length && e.start(0) > 0 && t < e.start(0) - l["default"].SAFE_TIME_DELTA)
                        }
                    }, {
                        key: "videoUnderflow_",
                        value: function(e, t, i) {
                            if (0 === e.length) {
                                var n = this.gapFromVideoUnderflow_(t, i);
                                if (n) return this.logger_("Encountered a gap in video from " + n.start + " to " + n.end + ". Seeking to current time " + i), !0
                            }
                            return !1
                        }
                    }, {
                        key: "skipTheGap_",
                        value: function(e) {
                            var t = this.tech_.buffered(),
                                i = this.tech_.currentTime(),
                                n = l["default"].findNextRange(t, i);
                            this.cancelTimer_(), 0 !== n.length && i === e && (this.logger_("skipTheGap_:", "currentTime:", i, "scheduled currentTime:", e, "nextRange start:", n.start(0)), this.tech_.setCurrentTime(n.start(0) + l["default"].TIME_FUDGE_FACTOR), this.tech_.trigger({
                                type: "usage",
                                name: "hls-gap-skip"
                            }))
                        }
                    }, {
                        key: "gapFromVideoUnderflow_",
                        value: function(e, t) {
                            for (var i = l["default"].findGaps(e), n = 0; n < i.length; n++) {
                                var r = i.start(n),
                                    a = i.end(n);
                                if (t - r < 4 && t - r > 2) return {
                                    start: r,
                                    end: a
                                }
                            }
                            return null
                        }
                    }, {
                        key: "logger_",
                        value: function() {}
                    }]), e
                }();
            i["default"] = p, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    9: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = e(15),
                d = n(u),
                l = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                f = e(33),
                c = n(f),
                h = e(32),
                p = n(h),
                m = function(e, t, i) {
                    var n = t.slice();
                    i = i || 0;
                    for (var r = Math.min(e.length, t.length + i), a = i; a < r; a++) n[a - i] = (0, l.mergeOptions)(e[a], n[a - i]);
                    return n
                };
            i.updateSegments = m;
            var g = function(e, t) {
                e.resolvedUri || (e.resolvedUri = (0, d["default"])(t, e.uri)), e.key && !e.key.resolvedUri && (e.key.resolvedUri = (0, d["default"])(t, e.key.uri)), e.map && !e.map.resolvedUri && (e.map.resolvedUri = (0, d["default"])(t, e.map.uri))
            };
            i.resolveSegmentUris = g;
            var y = function(e, t) {
                var i = (0, l.mergeOptions)(e, {}),
                    n = i.playlists.filter(function(e) {
                        return e.uri === t.uri
                    })[0];
                if (!n) return null;
                if (n.segments && t.segments && n.segments.length === t.segments.length && n.mediaSequence === t.mediaSequence) return null;
                var r = (0, l.mergeOptions)(n, t);
                n.segments && (r.segments = m(n.segments, t.segments, t.mediaSequence - n.mediaSequence)), r.segments.forEach(function(e) {
                    g(e, r.resolvedUri)
                });
                for (var a = 0; a < i.playlists.length; a++) i.playlists[a].uri === t.uri && (i.playlists[a] = r);
                return i.playlists[t.uri] = r, i
            };
            i.updateMaster = y;
            var _ = function(e) {
                for (var t = e.playlists.length; t--;) {
                    var i = e.playlists[t];
                    e.playlists[i.uri] = i, i.resolvedUri = (0, d["default"])(e.uri, i.uri), i.attributes || (i.attributes = {}, l.log.warn("Invalid playlist STREAM-INF detected. Missing BANDWIDTH attribute."))
                }
            };
            i.setupMediaPlaylists = _;
            var v = function(e) {
                ["AUDIO", "SUBTITLES"].forEach(function(t) {
                    for (var i in e.mediaGroups[t]) for (var n in e.mediaGroups[t][i]) {
                        var r = e.mediaGroups[t][i][n];
                        r.uri && (r.resolvedUri = (0, d["default"])(e.uri, r.uri))
                    }
                })
            };
            i.resolveMediaGroupUris = v;
            var b = function(e, t) {
                var i = e.segments[e.segments.length - 1];
                undefined;
                return t && i && i.duration ? 1e3 * i.duration : 500 * (e.targetDuration || 10)
            };
            i.refreshDelay = b;
            var T = function(e) {
                function t(e, i, n) {
                    var a = this;
                    if (r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.srcUrl = e, this.hls_ = i, this.withCredentials = n, !this.srcUrl) throw new Error("A non-empty playlist URL is required");
                    this.state = "HAVE_NOTHING", this.on("mediaupdatetimeout", function() {
                        "HAVE_METADATA" === a.state && (a.state = "HAVE_CURRENT_METADATA", a.request = a.hls_.xhr({
                            uri: (0, d["default"])(a.master.uri, a.media().uri),
                            withCredentials: a.withCredentials
                        }, function(e, t) {
                            if (a.request) return e ? a.playlistRequestError(a.request, a.media().uri, "HAVE_METADATA") : void a.haveMetadata(a.request, a.media().uri)
                        }))
                    })
                }
                return a(t, e), s(t, [{
                    key: "playlistRequestError",
                    value: function(e, t, i) {
                        this.request = null, i && (this.state = i), this.error = {
                            playlist: this.master.playlists[t],
                            status: e.status,
                            message: "HLS playlist request error at URL: " + t,
                            responseText: e.responseText,
                            code: e.status >= 500 ? 4 : 2
                        }, this.trigger("error")
                    }
                }, {
                    key: "haveMetadata",
                    value: function(e, t) {
                        var i = this;
                        this.request = null, this.state = "HAVE_METADATA";
                        var n = new c["default"].Parser;
                        n.push(e.responseText), n.end(), n.manifest.uri = t, n.manifest.attributes = n.manifest.attributes || {};
                        var r = y(this.master, n.manifest);
                        this.targetDuration = n.manifest.targetDuration, r ? (this.master = r, this.media_ = this.master.playlists[n.manifest.uri]) : this.trigger("playlistunchanged"), this.media().endList || (p["default"].clearTimeout(this.mediaUpdateTimeout), this.mediaUpdateTimeout = p["default"].setTimeout(function() {
                            i.trigger("mediaupdatetimeout")
                        }, b(this.media(), !! r))), this.trigger("loadedplaylist")
                    }
                }, {
                    key: "dispose",
                    value: function() {
                        this.stopRequest(), p["default"].clearTimeout(this.mediaUpdateTimeout)
                    }
                }, {
                    key: "stopRequest",
                    value: function() {
                        if (this.request) {
                            var e = this.request;
                            this.request = null, e.onreadystatechange = null, e.abort()
                        }
                    }
                }, {
                    key: "media",
                    value: function(e) {
                        var t = this;
                        if (!e) return this.media_;
                        if ("HAVE_NOTHING" === this.state) throw new Error("Cannot switch media playlist from " + this.state);
                        var i = this.state;
                        if ("string" == typeof e) {
                            if (!this.master.playlists[e]) throw new Error("Unknown playlist URI: " + e);
                            e = this.master.playlists[e]
                        }
                        var n = !this.media_ || e.uri !== this.media_.uri;
                        if (this.master.playlists[e.uri].endList) return this.request && (this.request.onreadystatechange = null, this.request.abort(), this.request = null), this.state = "HAVE_METADATA", this.media_ = e, void(n && (this.trigger("mediachanging"), this.trigger("mediachange")));
                        if (n) {
                            if (this.state = "SWITCHING_MEDIA", this.request) {
                                if ((0, d["default"])(this.master.uri, e.uri) === this.request.url) return;
                                this.request.onreadystatechange = null, this.request.abort(), this.request = null
                            }
                            this.media_ && this.trigger("mediachanging"), this.request = this.hls_.xhr({
                                uri: (0, d["default"])(this.master.uri, e.uri),
                                withCredentials: this.withCredentials
                            }, function(n, r) {
                                if (t.request) {
                                    if (n) return t.playlistRequestError(t.request, e.uri, i);
                                    t.haveMetadata(r, e.uri), "HAVE_MASTER" === i ? t.trigger("loadedmetadata") : t.trigger("mediachange")
                                }
                            })
                        }
                    }
                }, {
                    key: "pause",
                    value: function() {
                        this.stopRequest(), p["default"].clearTimeout(this.mediaUpdateTimeout), "HAVE_NOTHING" === this.state && (this.started = !1), "SWITCHING_MEDIA" === this.state ? this.media_ ? this.state = "HAVE_METADATA" : this.state = "HAVE_MASTER" : "HAVE_CURRENT_METADATA" === this.state && (this.state = "HAVE_METADATA")
                    }
                }, {
                    key: "load",
                    value: function(e) {
                        var t = this;
                        p["default"].clearTimeout(this.mediaUpdateTimeout);
                        var i = this.media();
                        if (e) {
                            var n = i ? i.targetDuration / 2 * 1e3 : 5e3;
                            return void(this.mediaUpdateTimeout = p["default"].setTimeout(function() {
                                return t.load()
                            }, n))
                        }
                        if (!this.started) return void this.start();
                        i && !i.endList ? this.trigger("mediaupdatetimeout") : this.trigger("loadedplaylist")
                    }
                }, {
                    key: "start",
                    value: function() {
                        var e = this;
                        this.started = !0, this.request = this.hls_.xhr({
                            uri: this.srcUrl,
                            withCredentials: this.withCredentials
                        }, function(t, i) {
                            if (e.request) {
                                if (e.request = null, t) return e.error = {
                                    status: i.status,
                                    message: "HLS playlist request error at URL: " + e.srcUrl,
                                    responseText: i.responseText,
                                    code: 2
                                }, "HAVE_NOTHING" === e.state && (e.started = !1), e.trigger("error");
                                var n = new c["default"].Parser;
                                return n.push(i.responseText), (n.end(), e.state = "HAVE_MASTER", n.manifest.uri = e.srcUrl, n.manifest.playlists) ? (e.master = n.manifest, _(e.master), v(e.master), e.trigger("loadedplaylist"), void(e.request || e.media(n.manifest.playlists[0]))) : (e.master = {
                                    mediaGroups: {
                                        AUDIO: {},
                                        VIDEO: {},
                                        "CLOSED-CAPTIONS": {},
                                        SUBTITLES: {}
                                    },
                                    uri: p["default"].location.href,
                                    playlists: [{
                                        uri: e.srcUrl
                                    }]
                                }, e.master.playlists[e.srcUrl] = e.master.playlists[0], e.master.playlists[0].resolvedUri = e.srcUrl, e.master.playlists[0].attributes = e.master.playlists[0].attributes || {}, e.haveMetadata(i, e.srcUrl), e.trigger("loadedmetadata"))
                            }
                        })
                    }
                }]), t
            }(l.EventTarget);
            i["default"] = T
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    10: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = e(3),
            a = n(r),
            s = e(11),
            o = n(s),
            u = e(19),
            d = function(e, t) {
                var i = undefined;
                return e ? (i = window.getComputedStyle(e), i ? i[t] : "") : ""
            }, l = function(e, t) {
                var i = e.slice();
                e.sort(function(e, n) {
                    var r = t(e, n);
                    return 0 === r ? i.indexOf(e) - i.indexOf(n) : r
                })
            }, f = function(e, t) {
                var i = undefined,
                    n = undefined;
                return e.attributes.BANDWIDTH && (i = e.attributes.BANDWIDTH), i = i || window.Number.MAX_VALUE, t.attributes.BANDWIDTH && (n = t.attributes.BANDWIDTH), n = n || window.Number.MAX_VALUE, i - n
            };
        i.comparePlaylistBandwidth = f;
        var c = function(e, t) {
            var i = undefined,
                n = undefined;
            return e.attributes.RESOLUTION && e.attributes.RESOLUTION.width && (i = e.attributes.RESOLUTION.width), i = i || window.Number.MAX_VALUE, t.attributes.RESOLUTION && t.attributes.RESOLUTION.width && (n = t.attributes.RESOLUTION.width), n = n || window.Number.MAX_VALUE, i === n && e.attributes.BANDWIDTH && t.attributes.BANDWIDTH ? e.attributes.BANDWIDTH - t.attributes.BANDWIDTH : i - n
        };
        i.comparePlaylistResolution = c;
        var h = function(e, t, i, n) {
            var r = e.playlists.map(function(e) {
                var t = undefined,
                    i = undefined,
                    n = undefined;
                return t = e.attributes.RESOLUTION && e.attributes.RESOLUTION.width, i = e.attributes.RESOLUTION && e.attributes.RESOLUTION.height, n = e.attributes.BANDWIDTH, n = n || window.Number.MAX_VALUE, {
                    bandwidth: n,
                    width: t,
                    height: i,
                    playlist: e
                }
            });
            l(r, function(e, t) {
                return e.bandwidth - t.bandwidth
            }), r = r.filter(function(e) {
                return !o["default"].isIncompatible(e.playlist)
            });
            var s = r.filter(function(e) {
                return o["default"].isEnabled(e.playlist)
            });
            s.length || (s = r.filter(function(e) {
                return !o["default"].isDisabled(e.playlist)
            }));
            var u = s.filter(function(e) {
                    return e.bandwidth * a["default"].BANDWIDTH_VARIANCE < t
                }),
                d = u[u.length - 1],
                f = u.filter(function(e) {
                    return e.bandwidth === d.bandwidth
                })[0],
                c = u.filter(function(e) {
                    return e.width && e.height
                });
            l(c, function(e, t) {
                return e.width - t.width
            });
            var h = c.filter(function(e) {
                return e.width === i && e.height === n
            });
            d = h[h.length - 1];
            var p = h.filter(function(e) {
                    return e.bandwidth === d.bandwidth
                })[0],
                m = undefined,
                g = undefined,
                y = undefined;
            p || (m = c.filter(function(e) {
                return e.width > i || e.height > n
            }), g = m.filter(function(e) {
                return e.width === m[0].width && e.height === m[0].height
            }), d = g[g.length - 1], y = g.filter(function(e) {
                return e.bandwidth === d.bandwidth
            })[0]);
            var _ = y || p || f || s[0] || r[0];
            return _ ? _.playlist : null
        };
        i.simpleSelector = h;
        var p = function() {
            return h(this.playlists.master, this.systemBandwidth, parseInt(d(this.tech_.el(), "width"), 10), parseInt(d(this.tech_.el(), "height"), 10))
        };
        i.lastBandwidthSelector = p;
        var m = function(e) {
            var t = -1;
            if (e < 0 || e > 1) throw new Error("Moving average bandwidth decay must be between 0 and 1.");
            return function() {
                return t < 0 && (t = this.systemBandwidth), t = e * this.systemBandwidth + (1 - e) * t, h(this.playlists.master, t, parseInt(d(this.tech_.el(), "width"), 10), parseInt(d(this.tech_.el(), "height"), 10))
            }
        };
        i.movingAverageBandwidthSelector = m;
        var g = function(e) {
            var t = e.master,
                i = e.currentTime,
                n = e.bandwidth,
                r = e.duration,
                a = e.segmentDuration,
                s = e.timeUntilRebuffer,
                u = e.currentTimeline,
                d = e.syncController,
                c = t.playlists.filter(function(e) {
                    return !o["default"].isIncompatible(e)
                }),
                h = c.filter(o["default"].isEnabled);
            h.length || (h = c.filter(function(e) {
                return !o["default"].isDisabled(e)
            }));
            var p = h.filter(o["default"].hasAttribute.bind(null, "BANDWIDTH")),
                m = p.map(function(e) {
                    var t = d.getSyncPoint(e, r, u, i),
                        l = t ? 1 : 2;
                    return {
                        playlist: e,
                        rebufferingImpact: o["default"].estimateSegmentRequestTime(a, n, e) * l - s
                    }
                }),
                g = m.filter(function(e) {
                    return e.rebufferingImpact <= 0
                });
            return l(g, function(e, t) {
                return f(t.playlist, e.playlist)
            }), g.length ? g[0] : (l(m, function(e, t) {
                return e.rebufferingImpact - t.rebufferingImpact
            }), m[0] || null)
        };
        i.minRebufferMaxBandwidthSelector = g;
        var y = function() {
            var e = this.playlists.master.playlists.filter(o["default"].isEnabled);
            return l(e, function(e, t) {
                return f(e, t)
            }), e.filter(function(e) {
                return (0, u.parseCodecs)(e.attributes.CODECS).videoCodec
            })[0] || null
        };
        i.lowestBitrateCompatibleVariantSelector = y
    }, {}],
    11: [function(e, t, i) {
        (function(t) {
            "use strict";
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                r = e(32),
                a = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(r),
                s = function(e, t) {
                    var i = 0,
                        n = t - e.mediaSequence,
                        r = e.segments[n];
                    if (r) {
                        if ("undefined" != typeof r.start) return {
                            result: r.start,
                            precise: !0
                        };
                        if ("undefined" != typeof r.end) return {
                            result: r.end - r.duration,
                            precise: !0
                        }
                    }
                    for (; n--;) {
                        if (r = e.segments[n], "undefined" != typeof r.end) return {
                            result: i + r.end,
                            precise: !0
                        };
                        if (i += r.duration, "undefined" != typeof r.start) return {
                            result: i + r.start,
                            precise: !0
                        }
                    }
                    return {
                        result: i,
                        precise: !1
                    }
                }, o = function(e, t) {
                    for (var i = 0, n = undefined, r = t - e.mediaSequence; r < e.segments.length; r++) {
                        if (n = e.segments[r], "undefined" != typeof n.start) return {
                            result: n.start - i,
                            precise: !0
                        };
                        if (i += n.duration, "undefined" != typeof n.end) return {
                            result: n.end - i,
                            precise: !0
                        }
                    }
                    return {
                        result: -1,
                        precise: !1
                    }
                }, u = function(e, t, i) {
                    var n = undefined,
                        r = undefined;
                    return void 0 === t && (t = e.mediaSequence + e.segments.length), t < e.mediaSequence ? 0 : (n = s(e, t), n.precise ? n.result : (r = o(e, t), r.precise ? r.result : n.result + i))
                }, d = function(e, t, i) {
                    if (!e) return 0;
                    if ("number" != typeof i && (i = 0), void 0 === t) {
                        if (e.totalDuration) return e.totalDuration;
                        if (!e.endList) return a["default"].Infinity
                    }
                    return u(e, t, i)
                };
            i.duration = d;
            var l = function(e, t, i) {
                var n = 0;
                if (t > i) {
                    var r = [i, t];
                    t = r[0], i = r[1]
                }
                if (t < 0) {
                    for (var a = t; a < Math.min(0, i); a++) n += e.targetDuration;
                    t = 0
                }
                for (var a = t; a < i; a++) n += e.segments[a].duration;
                return n
            };
            i.sumDurations = l;
            var f = function(e) {
                if (!e.segments.length) return 0;
                for (var t = e.segments.length - 1, i = e.segments[t].duration || e.targetDuration, n = i + 2 * e.targetDuration; t-- && !((i += e.segments[t].duration) >= n););
                return Math.max(0, t)
            };
            i.safeLiveIndex = f;
            var c = function(e, t, i) {
                if (!e || !e.segments) return null;
                if (e.endList) return d(e);
                if (null === t) return null;
                t = t || 0;
                var n = i ? f(e) : e.segments.length;
                return u(e, e.mediaSequence + n, t)
            };
            i.playlistEnd = c;
            var h = function(e, t) {
                var i = t || 0,
                    r = c(e, t, !0);
                return null === r ? (0, n.createTimeRange)() : (0, n.createTimeRange)(i, r)
            };
            i.seekable = h;
            var p = function(e) {
                    return e - Math.floor(e) == 0
                }, m = function(e, t) {
                    if (p(t)) return t + .1 * e;
                    for (var i = t.toString().split(".")[1].length, n = 1; n <= i; n++) {
                        var r = Math.pow(10, n),
                            a = t * r;
                        if (p(a) || n === i) return (a + e) / r
                    }
                }, g = m.bind(null, 1),
                y = m.bind(null, - 1),
                _ = function(e, t, i, n) {
                    var r = undefined,
                        a = undefined,
                        s = e.segments.length,
                        o = t - n;
                    if (o < 0) {
                        if (i > 0) for (r = i - 1; r >= 0; r--) if (a = e.segments[r], (o += y(a.duration)) > 0) return {
                            mediaIndex: r,
                            startTime: n - l(e, i, r)
                        };
                        return {
                            mediaIndex: 0,
                            startTime: t
                        }
                    }
                    if (i < 0) {
                        for (r = i; r < 0; r++) if ((o -= e.targetDuration) < 0) return {
                            mediaIndex: 0,
                            startTime: t
                        };
                        i = 0
                    }
                    for (r = i; r < s; r++) if (a = e.segments[r], (o -= g(a.duration)) < 0) return {
                        mediaIndex: r,
                        startTime: n + l(e, i, r)
                    };
                    return {
                        mediaIndex: s - 1,
                        startTime: t
                    }
                };
            i.getMediaInfoForTime = _;
            var v = function(e) {
                return e.excludeUntil && e.excludeUntil > Date.now()
            };
            i.isBlacklisted = v;
            var b = function(e) {
                return e.excludeUntil && e.excludeUntil === Infinity
            };
            i.isIncompatible = b;
            var T = function(e) {
                var t = v(e);
                return !e.disabled && !t
            };
            i.isEnabled = T;
            var S = function(e) {
                return e.disabled
            };
            i.isDisabled = S;
            var w = function(e) {
                for (var t = 0; t < e.segments.length; t++) if (e.segments[t].key) return !0;
                return !1
            };
            i.isAes = w;
            var k = function(e) {
                for (var t = 0; t < e.segments.length; t++) if (e.segments[t].map) return !0;
                return !1
            };
            i.isFmp4 = k;
            var O = function(e, t) {
                return t.attributes && t.attributes[e]
            };
            i.hasAttribute = O;
            var E = function(e, t, i) {
                var n = arguments.length <= 3 || arguments[3] === undefined ? 0 : arguments[3];
                return O("BANDWIDTH", i) ? (e * i.attributes.BANDWIDTH - 8 * n) / t : NaN
            };
            i.estimateSegmentRequestTime = E;
            var A = function(e, t) {
                if (1 === e.playlists.length) return !0;
                var i = t.attributes.BANDWIDTH || Number.MAX_VALUE;
                return 0 === e.playlists.filter(function(e) {
                    return !!T(e) && (e.attributes.BANDWIDTH || 0) < i
                }).length
            };
            i.isLowestEnabledRendition = A, i["default"] = {
                duration: d,
                seekable: h,
                safeLiveIndex: f,
                getMediaInfoForTime: _,
                isEnabled: T,
                isDisabled: S,
                isBlacklisted: v,
                isIncompatible: b,
                playlistEnd: c,
                isAes: w,
                isFmp4: k,
                hasAttribute: O,
                estimateSegmentRequestTime: E,
                isLowestEnabledRendition: A
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    12: [function(e, t, i) {
        (function(e) {
            "use strict";
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = function() {
                    function e(e, t) {
                        var i = [],
                            n = !0,
                            r = !1,
                            a = undefined;
                        try {
                            for (var s, o = e[Symbol.iterator](); !(n = (s = o.next()).done) && (i.push(s.value), !t || i.length !== t); n = !0);
                        } catch (u) {
                            r = !0, a = u
                        } finally {
                            try {
                                !n && o["return"] && o["return"]()
                            } finally {
                                if (r) throw a
                            }
                        }
                        return i
                    }
                    return function(t, i) {
                        if (Array.isArray(t)) return t;
                        if (Symbol.iterator in Object(t)) return e(t, i);
                        throw new TypeError("Invalid attempt to destructure non-iterable instance")
                    }
                }(),
                r = "undefined" != typeof window ? window.videojs : void 0 !== e ? e.videojs : null,
                a = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(r),
                s = function(e, t) {
                    var i = n(t, 2),
                        r = i[0],
                        a = i[1];
                    return Math.min(Math.max(r, e), a)
                }, o = function(e, t) {
                    var i = [],
                        n = undefined;
                    if (e && e.length) for (n = 0; n < e.length; n++) t(e.start(n), e.end(n)) && i.push([e.start(n), e.end(n)]);
                    return a["default"].createTimeRanges(i)
                }, u = function(e, t) {
                    return o(e, function(e, i) {
                        return e - 1 / 30 <= t && i + 1 / 30 >= t
                    })
                }, d = function(e, t) {
                    return o(e, function(e) {
                        return e - 1 / 30 >= t
                    })
                }, l = function(e) {
                    if (e.length < 2) return a["default"].createTimeRanges();
                    for (var t = [], i = 1; i < e.length; i++) {
                        var n = e.end(i - 1),
                            r = e.start(i);
                        t.push([n, r])
                    }
                    return a["default"].createTimeRanges(t)
                }, f = function(e, t) {
                    var i = undefined,
                        n = undefined,
                        r = undefined,
                        a = [],
                        s = [],
                        o = function(e) {
                            return e[0] <= r && e[1] >= r
                        };
                    if (e) for (i = 0; i < e.length; i++) n = e.start(i), r = e.end(i), s.push([n, r]);
                    if (t) for (i = 0; i < t.length; i++) n = t.start(i), r = t.end(i), s.some(o) || a.push(r);
                    return 1 !== a.length ? null : a[0]
                }, c = function(e, t) {
                    var i = null,
                        n = null,
                        r = 0,
                        s = [],
                        o = [];
                    if (!(e && e.length && t && t.length)) return a["default"].createTimeRange();
                    for (var u = e.length; u--;) s.push({
                        time: e.start(u),
                        type: "start"
                    }), s.push({
                        time: e.end(u),
                        type: "end"
                    });
                    for (u = t.length; u--;) s.push({
                        time: t.start(u),
                        type: "start"
                    }), s.push({
                        time: t.end(u),
                        type: "end"
                    });
                    for (s.sort(function(e, t) {
                        return e.time - t.time
                    }), u = 0; u < s.length; u++) "start" === s[u].type ? 2 === ++r && (i = s[u].time) : "end" === s[u].type && 1 === --r && (n = s[u].time), null !== i && null !== n && (o.push([i, n]), i = null, n = null);
                    return a["default"].createTimeRanges(o)
                }, h = function(e, t, i, n) {
                    for (var r = t.end(0) - t.start(0), a = e.end(0) - e.start(0), s = r - a, o = c(e, n), u = c(t, n), d = 0, l = 0, f = o.length; f--;) d += o.end(f) - o.start(f), o.start(f) === i && (d += s);
                    for (f = u.length; f--;) l += u.end(f) - u.start(f);
                    return Math.max(d, l) / r * 100
                }, p = function(e, t, i, n) {
                    var r = e + t,
                        o = a["default"].createTimeRanges([
                            [e, r]
                        ]),
                        u = a["default"].createTimeRanges([
                            [s(e, [i, r]), r]
                        ]);
                    if (u.start(0) === u.end(0)) return 0;
                    var d = h(u, o, i, n);
                    return isNaN(d) || d === Infinity || d === -Infinity ? 0 : d
                }, m = function(e) {
                    var t = [];
                    if (!e || !e.length) return "";
                    for (var i = 0; i < e.length; i++) t.push(e.start(i) + " => " + e.end(i));
                    return t.join(", ")
                }, g = function(e, t) {
                    var i = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];
                    return ((e.length ? e.end(e.length - 1) : 0) - t) / i
                };
            i["default"] = {
                findRange: u,
                findNextRange: d,
                findGaps: l,
                findSoleUncommonTimeRangesEnd: f,
                getSegmentBufferedPercent: p,
                TIME_FUDGE_FACTOR: 1 / 30,
                SAFE_TIME_DELTA: .1,
                printableRange: m,
                timeUntilRebuffer: g
            }, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    13: [function(e, t, i) {
        (function(e) {
            "use strict";
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = "undefined" != typeof window ? window.videojs : void 0 !== e ? e.videojs : null,
                r = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(n),
                a = {
                    errorInterval: 30,
                    getSource: function(e) {
                        return e(this.tech({
                            IWillNotUseThisInPlugins: !0
                        }).currentSource_)
                    }
                }, s = function u(e, t) {
                    var i = 0,
                        n = 0,
                        s = r["default"].mergeOptions(a, t);
                    e.ready(function() {
                        e.trigger({
                            type: "usage",
                            name: "hls-error-reload-initialized"
                        })
                    });
                    var o = function() {
                        n && e.currentTime(n)
                    }, d = function(t) {
                        null !== t && t !== undefined && (n = e.duration() !== Infinity && e.currentTime() || 0, e.one("loadedmetadata", o), e.src(t), e.trigger({
                            type: "usage",
                            name: "hls-error-reload"
                        }), e.play())
                    }, l = function() {
                        return Date.now() - i < 1e3 * s.errorInterval ? void e.trigger({
                            type: "usage",
                            name: "hls-error-reload-canceled"
                        }) : s.getSource && "function" == typeof s.getSource ? (i = Date.now(), s.getSource.call(e, d)) : void r["default"].log.error("ERROR: reloadSourceOnError - The option getSource must be a function!")
                    }, f = function h() {
                        e.off("loadedmetadata", o), e.off("error", l), e.off("dispose", h)
                    }, c = function(t) {
                        f(), u(e, t)
                    };
                    e.on("error", l), e.on("dispose", f), e.reloadSourceOnError = c
                }, o = function(e) {
                    s(this, e)
                };
            i["default"] = o, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    14: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = e(11),
            a = function(e, t, i) {
                return function(n) {
                    var a = e.master.playlists[t],
                        s = (0, r.isIncompatible)(a),
                        o = (0, r.isEnabled)(a);
                    return void 0 === n ? o : (n ? delete a.disabled : a.disabled = !0, n === o || s || (i(), n ? e.trigger("renditionenabled") : e.trigger("renditiondisabled")), n)
                }
            }, s = function u(e, t, i) {
                n(this, u);
                var r = e.masterPlaylistController_.fastQualityChange_.bind(e.masterPlaylistController_);
                if (t.attributes.RESOLUTION) {
                    var s = t.attributes.RESOLUTION;
                    this.width = s.width, this.height = s.height
                }
                this.bandwidth = t.attributes.BANDWIDTH, this.id = i, this.enabled = a(e.playlists, t.uri, r)
            }, o = function(e) {
                var t = e.playlists;
                e.representations = function() {
                    return t.master.playlists.filter(function(e) {
                        return !(0, r.isIncompatible)(e)
                    }).map(function(t, i) {
                        return new s(e, t, t.uri)
                    })
                }
            };
        i["default"] = o, t.exports = i["default"]
    }, {}],
    15: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = e(63),
            a = n(r),
            s = e(32),
            o = n(s),
            u = function(e, t) {
                return /^[a-z]+:/i.test(t) ? t : (/\/\//i.test(e) || (e = a["default"].buildAbsoluteURL(o["default"].location.href, e)), a["default"].buildAbsoluteURL(e, t))
            };
        i["default"] = u, t.exports = i["default"]
    }, {}],
    16: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = e(11),
                d = n(u),
                l = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                f = n(l),
                c = e(17),
                h = n(c),
                p = e(3),
                m = n(p),
                g = e(32),
                y = n(g),
                _ = e(72),
                v = n(_),
                b = e(2),
                T = e(7),
                S = e(12),
                w = e(10),
                k = function(e, t, i) {
                    if (!e || !t) return !1;
                    var n = e.segments,
                        r = i === n.length;
                    return e.endList && "open" === t.readyState && r
                }, O = function(e) {
                    return "number" == typeof e && isFinite(e)
                }, E = function(e, t, i) {
                    return "main" === e && t && i ? i.containsAudio || i.containsVideo ? t.containsVideo && !i.containsVideo ? "Only audio found in segment when we expected video. We can't switch to audio only from a stream that had video. To get rid of this message, please add codec information to the manifest." : !t.containsVideo && i.containsVideo ? "Video found in segment when we expected only audio. We can't switch to a stream with video from an audio only stream. To get rid of this message, please add codec information to the manifest." : null : "Neither audio nor video found in segment." : null
                };
            i.illegalMediaSwitch = E;
            var A = function(e, t, i) {
                var n = undefined;
                return n = e.length && e.start(0) > 0 && e.start(0) < t ? e.start(0) : t - 30, Math.min(n, t - i)
            };
            i.safeBackBufferTrimTime = A;
            var L = function(e) {
                function t(e) {
                    var i = this,
                        n = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                    if (r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), !e) throw new TypeError("Initialization settings are required");
                    if ("function" != typeof e.currentTime) throw new TypeError("No currentTime getter specified");
                    if (!e.mediaSource) throw new TypeError("No MediaSource specified");
                    this.state = "INIT", this.bandwidth = e.bandwidth, this.throughput = {
                        rate: 0,
                        count: 0
                    }, this.roundTrip = NaN, this.resetStats_(), this.mediaIndex = null, this.hasPlayed_ = e.hasPlayed, this.currentTime_ = e.currentTime, this.seekable_ = e.seekable, this.seeking_ = e.seeking, this.duration_ = e.duration, this.mediaSource_ = e.mediaSource, this.hls_ = e.hls, this.loaderType_ = e.loaderType, this.startingMedia_ = void 0, this.segmentMetadataTrack_ = e.segmentMetadataTrack, this.goalBufferLength_ = e.goalBufferLength, this.checkBufferTimeout_ = null, this.error_ = void 0, this.currentTimeline_ = -1, this.pendingSegment_ = null, this.mimeType_ = null, this.sourceUpdater_ = null, this.xhrOptions_ = null, this.activeInitSegmentId_ = null, this.initSegments_ = {}, this.decrypter_ = e.decrypter, this.syncController_ = e.syncController, this.syncPoint_ = {
                        segmentIndex: 0,
                        time: 0
                    }, this.syncController_.on("syncinfoupdate", function() {
                        return i.trigger("syncinfoupdate")
                    }), this.mediaSource_.addEventListener("sourceopen", function() {
                        return i.ended_ = !1
                    }), this.fetchAtBuffer_ = !1, n.debug && (this.logger_ = f["default"].log.bind(f["default"], "segment-loader", this.loaderType_, "->"))
                }
                return a(t, e), s(t, [{
                    key: "resetStats_",
                    value: function() {
                        this.mediaBytesTransferred = 0, this.mediaRequests = 0, this.mediaRequestsAborted = 0, this.mediaRequestsTimedout = 0, this.mediaRequestsErrored = 0, this.mediaTransferDuration = 0, this.mediaSecondsLoaded = 0
                    }
                }, {
                    key: "dispose",
                    value: function() {
                        this.state = "DISPOSED", this.pause(), this.abort_(), this.sourceUpdater_ && this.sourceUpdater_.dispose(), this.resetStats_()
                    }
                }, {
                    key: "abort",
                    value: function() {
                        if ("WAITING" !== this.state) return void(this.pendingSegment_ && (this.pendingSegment_ = null));
                        this.abort_(), this.state = "READY", this.paused() || this.monitorBuffer_()
                    }
                }, {
                    key: "abort_",
                    value: function() {
                        this.pendingSegment_ && this.pendingSegment_.abortRequests(), this.pendingSegment_ = null
                    }
                }, {
                    key: "error",
                    value: function(e) {
                        return void 0 !== e && (this.error_ = e), this.pendingSegment_ = null, this.error_
                    }
                }, {
                    key: "endOfStream",
                    value: function() {
                        this.ended_ = !0, this.pause(), this.trigger("ended")
                    }
                }, {
                    key: "buffered_",
                    value: function() {
                        return this.sourceUpdater_ ? this.sourceUpdater_.buffered() : f["default"].createTimeRanges()
                    }
                }, {
                    key: "initSegment",
                    value: function(e) {
                        var t = !(arguments.length <= 1 || arguments[1] === undefined) && arguments[1];
                        if (!e) return null;
                        var i = (0, b.initSegmentId)(e),
                            n = this.initSegments_[i];
                        return t && !n && e.bytes && (this.initSegments_[i] = n = {
                            resolvedUri: e.resolvedUri,
                            byterange: e.byterange,
                            bytes: e.bytes
                        }), n || e
                    }
                }, {
                    key: "couldBeginLoading_",
                    value: function() {
                        return this.playlist_ && (this.sourceUpdater_ || this.mimeType_ && "INIT" === this.state) && !this.paused()
                    }
                }, {
                    key: "load",
                    value: function() {
                        if (this.monitorBuffer_(),
                            this.playlist_) {
                            if (this.syncController_.setDateTimeMapping(this.playlist_), "INIT" === this.state && this.couldBeginLoading_()) return this.init_();
                            !this.couldBeginLoading_() || "READY" !== this.state && "INIT" !== this.state || (this.state = "READY")
                        }
                    }
                }, {
                    key: "init_",
                    value: function() {
                        return this.state = "READY", this.sourceUpdater_ = new h["default"](this.mediaSource_, this.mimeType_), this.resetEverything(), this.monitorBuffer_()
                    }
                }, {
                    key: "playlist",
                    value: function(e) {
                        var t = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        if (e) {
                            var i = this.playlist_,
                                n = this.pendingSegment_;
                            if (this.playlist_ = e, this.xhrOptions_ = t, this.hasPlayed_() || (e.syncInfo = {
                                mediaSequence: e.mediaSequence,
                                time: 0
                            }), this.trigger("syncinfoupdate"), "INIT" === this.state && this.couldBeginLoading_()) return this.init_();
                            if (!i || i.uri !== e.uri) return void(null !== this.mediaIndex && this.resyncLoader());
                            var r = e.mediaSequence - i.mediaSequence;
                            this.logger_("mediaSequenceDiff", r), null !== this.mediaIndex && (this.mediaIndex -= r), n && (n.mediaIndex -= r, n.mediaIndex >= 0 && (n.segment = e.segments[n.mediaIndex])), this.syncController_.saveExpiredSegmentInfo(i, e)
                        }
                    }
                }, {
                    key: "pause",
                    value: function() {
                        this.checkBufferTimeout_ && (y["default"].clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = null)
                    }
                }, {
                    key: "paused",
                    value: function() {
                        return null === this.checkBufferTimeout_
                    }
                }, {
                    key: "mimeType",
                    value: function(e) {
                        this.mimeType_ || (this.mimeType_ = e, "INIT" === this.state && this.couldBeginLoading_() && this.init_())
                    }
                }, {
                    key: "resetEverything",
                    value: function() {
                        this.ended_ = !1, this.resetLoader(), this.remove(0, this.duration_()), this.trigger("reseteverything")
                    }
                }, {
                    key: "resetLoader",
                    value: function() {
                        this.fetchAtBuffer_ = !1, this.resyncLoader()
                    }
                }, {
                    key: "resyncLoader",
                    value: function() {
                        this.mediaIndex = null, this.syncPoint_ = null, this.abort()
                    }
                }, {
                    key: "remove",
                    value: function(e, t) {
                        this.sourceUpdater_ && this.sourceUpdater_.remove(e, t), (0, v["default"])(e, t, this.segmentMetadataTrack_)
                    }
                }, {
                    key: "monitorBuffer_",
                    value: function() {
                        this.checkBufferTimeout_ && y["default"].clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = y["default"].setTimeout(this.monitorBufferTick_.bind(this), 1)
                    }
                }, {
                    key: "monitorBufferTick_",
                    value: function() {
                        "READY" === this.state && this.fillBuffer_(), this.checkBufferTimeout_ && y["default"].clearTimeout(this.checkBufferTimeout_), this.checkBufferTimeout_ = y["default"].setTimeout(this.monitorBufferTick_.bind(this), 500)
                    }
                }, {
                    key: "fillBuffer_",
                    value: function() {
                        if (!this.sourceUpdater_.updating()) {
                            this.syncPoint_ || (this.syncPoint_ = this.syncController_.getSyncPoint(this.playlist_, this.duration_(), this.currentTimeline_, this.currentTime_()));
                            var e = this.checkBuffer_(this.buffered_(), this.playlist_, this.mediaIndex, this.hasPlayed_(), this.currentTime_(), this.syncPoint_);
                            if (e) {
                                if (k(this.playlist_, this.mediaSource_, e.mediaIndex)) return void this.endOfStream();
                                (e.mediaIndex !== this.playlist_.segments.length - 1 || "ended" !== this.mediaSource_.readyState || this.seeking_()) && ((e.timeline !== this.currentTimeline_ || null !== e.startOfSegment && e.startOfSegment < this.sourceUpdater_.timestampOffset()) && (this.syncController_.reset(), e.timestampOffset = e.startOfSegment), this.loadSegment_(e))
                            }
                        }
                    }
                }, {
                    key: "checkBuffer_",
                    value: function(e, t, i, n, r, a) {
                        var s = 0,
                            o = undefined;
                        e.length && (s = e.end(e.length - 1));
                        var u = Math.max(0, s - r);
                        if (!t.segments.length) return null;
                        if (u >= this.goalBufferLength_()) return null;
                        if (!n && u >= 1) return null;
                        if (this.logger_("checkBuffer_", "mediaIndex:", i, "hasPlayed:", n, "currentTime:", r, "syncPoint:", a, "fetchAtBuffer:", this.fetchAtBuffer_, "bufferedTime:", u), null === a) return i = this.getSyncSegmentCandidate_(t), this.logger_("getSync", "mediaIndex:", i), this.generateSegmentInfo_(t, i, null, !0);
                        if (null !== i) {
                            this.logger_("walkForward", "mediaIndex:", i + 1);
                            var l = t.segments[i];
                            return o = l && l.end ? l.end : s, this.generateSegmentInfo_(t, i + 1, o, !1)
                        }
                        if (this.fetchAtBuffer_) {
                            var f = d["default"].getMediaInfoForTime(t, s, a.segmentIndex, a.time);
                            i = f.mediaIndex, o = f.startTime
                        } else {
                            var f = d["default"].getMediaInfoForTime(t, r, a.segmentIndex, a.time);
                            i = f.mediaIndex, o = f.startTime
                        }
                        return this.logger_("getMediaIndexForTime", "mediaIndex:", i, "startOfSegment:", o), this.generateSegmentInfo_(t, i, o, !1)
                    }
                }, {
                    key: "getSyncSegmentCandidate_",
                    value: function(e) {
                        var t = this;
                        if (-1 === this.currentTimeline_) return 0;
                        var i = e.segments.map(function(e, t) {
                            return {
                                timeline: e.timeline,
                                segmentIndex: t
                            }
                        }).filter(function(e) {
                            return e.timeline === t.currentTimeline_
                        });
                        return i.length ? i[Math.min(i.length - 1, 1)].segmentIndex : Math.max(e.segments.length - 1, 0)
                    }
                }, {
                    key: "generateSegmentInfo_",
                    value: function(e, t, i, n) {
                        if (t < 0 || t >= e.segments.length) return null;
                        var r = e.segments[t];
                        return {
                            requestId: "segment-loader-" + Math.random(),
                            uri: r.resolvedUri,
                            mediaIndex: t,
                            isSyncRequest: n,
                            startOfSegment: i,
                            playlist: e,
                            bytes: null,
                            encryptedBytes: null,
                            timestampOffset: null,
                            timeline: r.timeline,
                            duration: r.duration,
                            segment: r
                        }
                    }
                }, {
                    key: "abortRequestEarly_",
                    value: function(e) {
                        if (this.hls_.tech_.paused() || !this.xhrOptions_.timeout || !this.playlist_.attributes.BANDWIDTH) return !1;
                        if (Date.now() - (e.firstBytesReceivedAt || Date.now()) < 1e3) return !1;
                        var t = this.currentTime_(),
                            i = e.bandwidth,
                            n = this.pendingSegment_.duration,
                            r = d["default"].estimateSegmentRequestTime(n, i, this.playlist_, e.bytesReceived),
                            a = (0, S.timeUntilRebuffer)(this.buffered_(), t, this.hls_.tech_.playbackRate()) - 1;
                        if (r <= a) return !1;
                        var s = (0, w.minRebufferMaxBandwidthSelector)({
                            master: this.hls_.playlists.master,
                            currentTime: t,
                            bandwidth: i,
                            duration: this.duration_(),
                            segmentDuration: n,
                            timeUntilRebuffer: a,
                            currentTimeline: this.currentTimeline_,
                            syncController: this.syncController_
                        });
                        if (s) {
                            var o = r - a,
                                u = o - s.rebufferingImpact,
                                l = .5;
                            return a <= S.TIME_FUDGE_FACTOR && (l = 1), !s.playlist || s.playlist.uri === this.playlist_.uri || u < l ? !1 : (this.bandwidth = s.playlist.attributes.BANDWIDTH * m["default"].BANDWIDTH_VARIANCE + 1, this.abort(), this.trigger("earlyabort"), !0)
                        }
                    }
                }, {
                    key: "handleProgress_",
                    value: function(e, t) {
                        this.pendingSegment_ && t.requestId === this.pendingSegment_.requestId && !this.abortRequestEarly_(t.stats) && this.trigger("progress")
                    }
                }, {
                    key: "loadSegment_",
                    value: function(e) {
                        this.state = "WAITING", this.pendingSegment_ = e, this.trimBackBuffer_(e), e.abortRequests = (0, T.mediaSegmentRequest)(this.hls_.xhr, this.xhrOptions_, this.decrypter_, this.createSimplifiedSegmentObj_(e), this.handleProgress_.bind(this), this.segmentRequestFinished_.bind(this))
                    }
                }, {
                    key: "trimBackBuffer_",
                    value: function(e) {
                        var t = A(this.seekable_(), this.currentTime_(), this.playlist_.targetDuration || 10);
                        t > 0 && this.remove(0, t)
                    }
                }, {
                    key: "createSimplifiedSegmentObj_",
                    value: function(e) {
                        var t = e.segment,
                            i = {
                                resolvedUri: t.resolvedUri,
                                byterange: t.byterange,
                                requestId: e.requestId
                            };
                        if (t.key) {
                            var n = t.key.iv || new Uint32Array([0, 0, 0, e.mediaIndex + e.playlist.mediaSequence]);
                            i.key = {
                                resolvedUri: t.key.resolvedUri,
                                iv: n
                            }
                        }
                        return t.map && (i.map = this.initSegment(t.map)), i
                    }
                }, {
                    key: "segmentRequestFinished_",
                    value: function(e, t) {
                        if (this.mediaRequests += 1, t.stats && (this.mediaBytesTransferred += t.stats.bytesReceived, this.mediaTransferDuration += t.stats.roundTripTime), !this.pendingSegment_) return void(this.mediaRequestsAborted += 1);
                        if (t.requestId === this.pendingSegment_.requestId) {
                            if (e) return this.pendingSegment_ = null, this.state = "READY", e.code === T.REQUEST_ERRORS.ABORTED ? void(this.mediaRequestsAborted += 1) : (this.pause(), e.code === T.REQUEST_ERRORS.TIMEOUT ? (this.mediaRequestsTimedout += 1, this.bandwidth = 1, this.roundTrip = NaN, void this.trigger("bandwidthupdate")) : (this.mediaRequestsErrored += 1, this.error(e), void this.trigger("error")));
                            this.bandwidth = t.stats.bandwidth, this.roundTrip = t.stats.roundTripTime, t.map && (t.map = this.initSegment(t.map, !0)), this.processSegmentResponse_(t)
                        }
                    }
                }, {
                    key: "processSegmentResponse_",
                    value: function(e) {
                        var t = this.pendingSegment_;
                        t.bytes = e.bytes, e.map && (t.segment.map.bytes = e.map.bytes), t.endOfAllRequests = e.endOfAllRequests, this.handleSegment_()
                    }
                }, {
                    key: "handleSegment_",
                    value: function() {
                        var e = this;
                        if (!this.pendingSegment_) return void(this.state = "READY");
                        var t = this.pendingSegment_,
                            i = t.segment,
                            n = this.syncController_.probeSegmentInfo(t);
                        "undefined" == typeof this.startingMedia_ && n && (n.containsAudio || n.containsVideo) && (this.startingMedia_ = {
                            containsAudio: n.containsAudio,
                            containsVideo: n.containsVideo
                        });
                        var r = E(this.loaderType_, this.startingMedia_, n);
                        if (r) return this.error({
                            message: r,
                            blacklistDuration: Infinity
                        }), void this.trigger("error");
                        if (t.isSyncRequest) return this.trigger("syncinfoupdate"), this.pendingSegment_ = null, void(this.state = "READY");
                        null !== t.timestampOffset && t.timestampOffset !== this.sourceUpdater_.timestampOffset() && (this.sourceUpdater_.timestampOffset(t.timestampOffset), this.trigger("timestampoffset"));
                        var a = this.syncController_.mappingForTimeline(t.timeline);
                        null !== a && this.trigger({
                            type: "segmenttimemapping",
                            mapping: a
                        }), this.state = "APPENDING", i.map && function() {
                            var t = (0, b.initSegmentId)(i.map);
                            if (!e.activeInitSegmentId_ || e.activeInitSegmentId_ !== t) {
                                var n = e.initSegment(i.map);
                                e.sourceUpdater_.appendBuffer(n.bytes, function() {
                                    e.activeInitSegmentId_ = t
                                })
                            }
                        }(), t.byteLength = t.bytes.byteLength, "number" == typeof i.start && "number" == typeof i.end ? this.mediaSecondsLoaded += i.end - i.start : this.mediaSecondsLoaded += i.duration, this.sourceUpdater_.appendBuffer(t.bytes, this.handleUpdateEnd_.bind(this))
                    }
                }, {
                    key: "handleUpdateEnd_",
                    value: function() {
                        if (this.logger_("handleUpdateEnd_", "segmentInfo:", this.pendingSegment_), !this.pendingSegment_) return this.state = "READY", void(this.paused() || this.monitorBuffer_());
                        var e = this.pendingSegment_,
                            t = e.segment,
                            i = null !== this.mediaIndex;
                        if (this.pendingSegment_ = null, this.recordThroughput_(e), this.addSegmentMetadataCue_(e), this.state = "READY", this.mediaIndex = e.mediaIndex, this.fetchAtBuffer_ = !0, this.currentTimeline_ = e.timeline, this.trigger("syncinfoupdate"), t.end && this.currentTime_() - t.end > 3 * e.playlist.targetDuration) return void this.resetEverything();
                        i && this.trigger("bandwidthupdate"), this.trigger("progress"), k(e.playlist, this.mediaSource_, e.mediaIndex + 1) && this.endOfStream(), this.paused() || this.monitorBuffer_()
                    }
                }, {
                    key: "recordThroughput_",
                    value: function(e) {
                        var t = this.throughput.rate,
                            i = Date.now() - e.endOfAllRequests + 1,
                            n = Math.floor(e.byteLength / i * 8 * 1e3);
                        this.throughput.rate += (n - t) / ++this.throughput.count
                    }
                }, {
                    key: "logger_",
                    value: function() {}
                }, {
                    key: "addSegmentMetadataCue_",
                    value: function(e) {
                        if (this.segmentMetadataTrack_) {
                            var t = e.segment,
                                i = t.start,
                                n = t.end;
                            if (O(i) && O(n)) {
                                (0, v["default"])(i, n, this.segmentMetadataTrack_);
                                var r = y["default"].WebKitDataCue || y["default"].VTTCue,
                                    a = {
                                        bandwidth: e.playlist.attributes.BANDWIDTH,
                                        resolution: e.playlist.attributes.RESOLUTION,
                                        codecs: e.playlist.attributes.CODECS,
                                        byteLength: e.byteLength,
                                        uri: e.uri,
                                        timeline: e.timeline,
                                        playlist: e.playlist.uri,
                                        start: i,
                                        end: n
                                    }, s = JSON.stringify(a),
                                    o = new r(i, n, s);
                                o.value = a, this.segmentMetadataTrack_.addCue(o)
                            }
                        }
                    }
                }]), t
            }(f["default"].EventTarget);
            i["default"] = L
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    17: [function(e, t, i) {
        (function(e) {
            "use strict";

            function n(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var r = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                a = "undefined" != typeof window ? window.videojs : void 0 !== e ? e.videojs : null,
                s = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(a),
                o = function() {}, u = function() {
                    function e(t, i) {
                        var r = this;
                        n(this, e);
                        var a = function() {
                            r.sourceBuffer_ = t.addSourceBuffer(i), r.onUpdateendCallback_ = function() {
                                var e = r.pendingCallback_;
                                r.pendingCallback_ = null, e && e(), r.runCallback_()
                            }, r.sourceBuffer_.addEventListener("updateend", r.onUpdateendCallback_), r.runCallback_()
                        };
                        this.callbacks_ = [], this.pendingCallback_ = null, this.timestampOffset_ = 0, this.mediaSource = t, this.processedAppend_ = !1, "closed" === t.readyState ? t.addEventListener("sourceopen", a) : a()
                    }
                    return r(e, [{
                        key: "abort",
                        value: function(e) {
                            var t = this;
                            this.processedAppend_ && this.queueCallback_(function() {
                                t.sourceBuffer_.abort()
                            }, e)
                        }
                    }, {
                        key: "appendBuffer",
                        value: function(e, t) {
                            var i = this;
                            this.processedAppend_ = !0, this.queueCallback_(function() {
                                i.sourceBuffer_.appendBuffer(e)
                            }, t)
                        }
                    }, {
                        key: "buffered",
                        value: function() {
                            return this.sourceBuffer_ ? this.sourceBuffer_.buffered : s["default"].createTimeRanges()
                        }
                    }, {
                        key: "remove",
                        value: function(e, t) {
                            var i = this;
                            this.processedAppend_ && this.queueCallback_(function() {
                                i.sourceBuffer_.remove(e, t)
                            }, o)
                        }
                    }, {
                        key: "updating",
                        value: function() {
                            return !this.sourceBuffer_ || this.sourceBuffer_.updating || this.pendingCallback_
                        }
                    }, {
                        key: "timestampOffset",
                        value: function(e) {
                            var t = this;
                            return void 0 !== e && (this.queueCallback_(function() {
                                t.sourceBuffer_.timestampOffset = e
                            }), this.timestampOffset_ = e), this.timestampOffset_
                        }
                    }, {
                        key: "queueCallback_",
                        value: function(e, t) {
                            this.callbacks_.push([e.bind(this), t]), this.runCallback_()
                        }
                    }, {
                        key: "runCallback_",
                        value: function() {
                            var e = undefined;
                            !this.updating() && this.callbacks_.length && (e = this.callbacks_.shift(), this.pendingCallback_ = e[1], e[0]())
                        }
                    }, {
                        key: "dispose",
                        value: function() {
                            this.sourceBuffer_.removeEventListener("updateend", this.onUpdateendCallback_), this.sourceBuffer_ && "open" === this.mediaSource.readyState && this.sourceBuffer_.abort()
                        }
                    }]), e
                }();
            i["default"] = u, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    18: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = e(57),
                d = n(u),
                l = e(59),
                f = e(11),
                c = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                h = n(c),
                p = [{
                    name: "VOD",
                    run: function(e, t, i, n, r) {
                        if (i !== Infinity) {
                            return {
                                time: 0,
                                segmentIndex: 0
                            }
                        }
                        return null
                    }
                }, {
                    name: "ProgramDateTime",
                    run: function(e, t, i, n, r) {
                        if (e.datetimeToDisplayTime && t.dateTimeObject) {
                            return {
                                time: t.dateTimeObject.getTime() / 1e3 + e.datetimeToDisplayTime,
                                segmentIndex: 0
                            }
                        }
                        return null
                    }
                }, {
                    name: "Segment",
                    run: function(e, t, i, n, r) {
                        var a = t.segments || [],
                            s = null,
                            o = null;
                        r = r || 0;
                        for (var u = 0; u < a.length; u++) {
                            var d = a[u];
                            if (d.timeline === n && "undefined" != typeof d.start) {
                                var l = Math.abs(r - d.start);
                                if (null !== o && o < l) break;
                                (!s || null === o || o >= l) && (o = l, s = {
                                    time: d.start,
                                    segmentIndex: u
                                })
                            }
                        }
                        return s
                    }
                }, {
                    name: "Discontinuity",
                    run: function(e, t, i, n, r) {
                        var a = null;
                        if (r = r || 0, t.discontinuityStarts && t.discontinuityStarts.length) for (var s = null, o = 0; o < t.discontinuityStarts.length; o++) {
                            var u = t.discontinuityStarts[o],
                                d = t.discontinuitySequence + o + 1,
                                l = e.discontinuities[d];
                            if (l) {
                                var f = Math.abs(r - l.time);
                                if (null !== s && s < f) break;
                                (!a || null === s || s >= f) && (s = f, a = {
                                    time: l.time,
                                    segmentIndex: u
                                })
                            }
                        }
                        return a
                    }
                }, {
                    name: "Playlist",
                    run: function(e, t, i, n, r) {
                        if (t.syncInfo) {
                            return {
                                time: t.syncInfo.time,
                                segmentIndex: t.syncInfo.mediaSequence - t.mediaSequence
                            }
                        }
                        return null
                    }
                }];
            i.syncPointStrategies = p;
            var m = function(e) {
                function t() {
                    var e = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
                    r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.inspectCache_ = undefined, this.timelines = [], this.discontinuities = [], this.datetimeToDisplayTime = null, e.debug && (this.logger_ = h["default"].log.bind(h["default"], "sync-controller ->"))
                }
                return a(t, e), s(t, [{
                    key: "getSyncPoint",
                    value: function(e, t, i, n) {
                        var r = this.runStrategies_(e, t, i, n);
                        return r.length ? this.selectSyncPoint_(r, {
                            key: "time",
                            value: n
                        }) : null
                    }
                }, {
                    key: "getExpiredTime",
                    value: function(e, t) {
                        if (!e || !e.segments) return null;
                        var i = this.runStrategies_(e, t, e.discontinuitySequence, 0);
                        if (!i.length) return null;
                        var n = this.selectSyncPoint_(i, {
                            key: "segmentIndex",
                            value: 0
                        });
                        return n.segmentIndex > 0 && (n.time *= -1), Math.abs(n.time + (0, f.sumDurations)(e, n.segmentIndex, 0))
                    }
                }, {
                    key: "runStrategies_",
                    value: function(e, t, i, n) {
                        for (var r = [], a = 0; a < p.length; a++) {
                            var s = p[a],
                                o = s.run(this, e, t, i, n);
                            o && (o.strategy = s.name, r.push({
                                strategy: s.name,
                                syncPoint: o
                            }), this.logger_("syncPoint found via <" + s.name + ">:", o))
                        }
                        return r
                    }
                }, {
                    key: "selectSyncPoint_",
                    value: function(e, t) {
                        for (var i = e[0].syncPoint, n = Math.abs(e[0].syncPoint[t.key] - t.value), r = e[0].strategy, a = 1; a < e.length; a++) {
                            var s = Math.abs(e[a].syncPoint[t.key] - t.value);
                            s < n && (n = s, i = e[a].syncPoint, r = e[a].strategy)
                        }
                        return this.logger_("syncPoint with strategy <" + r + "> chosen: ", i), i
                    }
                }, {
                    key: "saveExpiredSegmentInfo",
                    value: function(e, t) {
                        for (var i = t.mediaSequence - e.mediaSequence, n = i - 1; n >= 0; n--) {
                            var r = e.segments[n];
                            if (r && "undefined" != typeof r.start) {
                                t.syncInfo = {
                                    mediaSequence: e.mediaSequence + n,
                                    time: r.start
                                }, this.logger_("playlist sync:", t.syncInfo), this.trigger("syncinfoupdate");
                                break
                            }
                        }
                    }
                }, {
                    key: "setDateTimeMapping",
                    value: function(e) {
                        if (!this.datetimeToDisplayTime && e.dateTimeObject) {
                            var t = e.dateTimeObject.getTime() / 1e3;
                            this.datetimeToDisplayTime = -t
                        }
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.inspectCache_ = undefined
                    }
                }, {
                    key: "probeSegmentInfo",
                    value: function(e) {
                        var t = e.segment,
                            i = e.playlist,
                            n = undefined;
                        return n = t.map ? this.probeMp4Segment_(e) : this.probeTsSegment_(e), n && this.calculateSegmentTimeMapping_(e, n) && (this.saveDiscontinuitySyncInfo_(e), i.syncInfo || (i.syncInfo = {
                            mediaSequence: i.mediaSequence + e.mediaIndex,
                            time: t.start
                        })), n
                    }
                }, {
                    key: "probeMp4Segment_",
                    value: function(e) {
                        var t = e.segment,
                            i = d["default"].timescale(t.map.bytes),
                            n = d["default"].startTime(i, e.bytes);
                        return null !== e.timestampOffset && (e.timestampOffset -= n), {
                            start: n,
                            end: n + t.duration
                        }
                    }
                }, {
                    key: "probeTsSegment_",
                    value: function(e) {
                        var t = (0, l.inspect)(e.bytes, this.inspectCache_),
                            i = undefined,
                            n = undefined;
                        return t ? (t.video && 2 === t.video.length ? (this.inspectCache_ = t.video[1].dts, i = t.video[0].dtsTime, n = t.video[1].dtsTime) : t.audio && 2 === t.audio.length && (this.inspectCache_ = t.audio[1].dts, i = t.audio[0].dtsTime, n = t.audio[1].dtsTime), {
                            start: i,
                            end: n,
                            containsVideo: t.video && 2 === t.video.length,
                            containsAudio: t.audio && 2 === t.audio.length
                        }) : null
                    }
                }, {
                    key: "timestampOffsetForTimeline",
                    value: function(e) {
                        return "undefined" == typeof this.timelines[e] ? null : this.timelines[e].time
                    }
                }, {
                    key: "mappingForTimeline",
                    value: function(e) {
                        return "undefined" == typeof this.timelines[e] ? null : this.timelines[e].mapping
                    }
                }, {
                    key: "calculateSegmentTimeMapping_",
                    value: function(e, t) {
                        var i = e.segment,
                            n = this.timelines[e.timeline];
                        if (null !== e.timestampOffset) this.logger_("tsO:", e.timestampOffset), n = {
                            time: e.startOfSegment,
                            mapping: e.startOfSegment - t.start
                        }, this.timelines[e.timeline] = n, this.trigger("timestampoffset"), i.start = e.startOfSegment, i.end = t.end + n.mapping;
                        else {
                            if (!n) return !1;
                            i.start = t.start + n.mapping, i.end = t.end + n.mapping
                        }
                        return !0
                    }
                }, {
                    key: "saveDiscontinuitySyncInfo_",
                    value: function(e) {
                        var t = e.playlist,
                            i = e.segment;
                        if (i.discontinuity) this.discontinuities[i.timeline] = {
                            time: i.start,
                            accuracy: 0
                        };
                        else if (t.discontinuityStarts.length) for (var n = 0; n < t.discontinuityStarts.length; n++) {
                            var r = t.discontinuityStarts[n],
                                a = t.discontinuitySequence + n + 1,
                                s = r - e.mediaIndex,
                                o = Math.abs(s);
                            if (!this.discontinuities[a] || this.discontinuities[a].accuracy > o) {
                                var u = undefined;
                                u = s < 0 ? i.start - (0, f.sumDurations)(t, e.mediaIndex, r) : i.end + (0, f.sumDurations)(t, e.mediaIndex + 1, r), this.discontinuities[a] = {
                                    time: u,
                                    accuracy: o
                                }
                            }
                        }
                    }
                }, {
                    key: "logger_",
                    value: function() {}
                }]), t
            }(h["default"].EventTarget);
            i["default"] = m
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    19: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function() {
            var e = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0],
                t = {
                    codecCount: 0
                }, i = undefined;
            return t.codecCount = e.split(",").length, t.codecCount = t.codecCount || 2, i = /(^|\s|,)+(avc1)([^ ,]*)/i.exec(e), i && (t.videoCodec = i[2], t.videoObjectTypeIndicator = i[3]), t.audioProfile = /(^|\s|,)+mp4a.[0-9A-Fa-f]+\.([0-9A-Fa-f]+)/i.exec(e), t.audioProfile = t.audioProfile && t.audioProfile[2], t
        };
        i.parseCodecs = n
    }, {}],
    20: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                u = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, d = e(16),
                l = r(d),
                f = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                c = r(f),
                h = e(32),
                p = r(h),
                m = e(72),
                g = r(m),
                y = e(2),
                _ = new Uint8Array("\n\n".split("").map(function(e) {
                    return e.charCodeAt(0)
                })),
                v = function(e) {
                    return String.fromCharCode.apply(null, e)
                }, b = function(e) {
                    function t(e) {
                        var i = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
                        a(this, t), u(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, e, i), this.mediaSource_ = null, this.subtitlesTrack_ = null
                    }
                    return s(t, e), o(t, [{
                        key: "buffered_",
                        value: function() {
                            if (!this.subtitlesTrack_ || !this.subtitlesTrack_.cues.length) return c["default"].createTimeRanges();
                            var e = this.subtitlesTrack_.cues,
                                t = e[0].startTime,
                                i = e[e.length - 1].startTime;
                            return c["default"].createTimeRanges([
                                [t, i]
                            ])
                        }
                    }, {
                        key: "initSegment",
                        value: function(e) {
                            var t = !(arguments.length <= 1 || arguments[1] === undefined) && arguments[1];
                            if (!e) return null;
                            var i = (0, y.initSegmentId)(e),
                                n = this.initSegments_[i];
                            if (t && !n && e.bytes) {
                                var r = _.byteLength + e.bytes.byteLength,
                                    a = new Uint8Array(r);
                                a.set(e.bytes), a.set(_, e.bytes.byteLength), this.initSegments_[i] = n = {
                                    resolvedUri: e.resolvedUri,
                                    byterange: e.byterange,
                                    bytes: a
                                }
                            }
                            return n || e
                        }
                    }, {
                        key: "couldBeginLoading_",
                        value: function() {
                            return this.playlist_ && this.subtitlesTrack_ && !this.paused()
                        }
                    }, {
                        key: "init_",
                        value: function() {
                            return this.state = "READY", this.resetEverything(), this.monitorBuffer_()
                        }
                    }, {
                        key: "track",
                        value: function(e) {
                            return void 0 === e ? this.subtitlesTrack_ : (this.subtitlesTrack_ = e, "INIT" === this.state && this.couldBeginLoading_() && this.init_(), this.subtitlesTrack_)
                        }
                    }, {
                        key: "remove",
                        value: function(e, t) {
                            (0, g["default"])(e, t, this.subtitlesTrack_)
                        }
                    }, {
                        key: "fillBuffer_",
                        value: function() {
                            var e = this;
                            this.syncPoint_ || (this.syncPoint_ = this.syncController_.getSyncPoint(this.playlist_, this.duration_(), this.currentTimeline_, this.currentTime_()));
                            var t = this.checkBuffer_(this.buffered_(), this.playlist_, this.mediaIndex, this.hasPlayed_(), this.currentTime_(), this.syncPoint_);
                            if (t = this.skipEmptySegments_(t)) {
                                if (null === this.syncController_.timestampOffsetForTimeline(t.timeline)) {
                                    var i = function() {
                                        e.state = "READY", e.paused() || e.monitorBuffer_()
                                    };
                                    return this.syncController_.one("timestampoffset", i), void(this.state = "WAITING_ON_TIMELINE")
                                }
                                this.loadSegment_(t)
                            }
                        }
                    }, {
                        key: "skipEmptySegments_",
                        value: function(e) {
                            for (; e && e.segment.empty;) e = this.generateSegmentInfo_(e.playlist, e.mediaIndex + 1, e.startOfSegment + e.duration, e.isSyncRequest);
                            return e
                        }
                    }, {
                        key: "handleSegment_",
                        value: function() {
                            var e = this;
                            if (!this.pendingSegment_ || !this.subtitlesTrack_) return void(this.state = "READY");
                            this.state = "APPENDING";
                            var t = this.pendingSegment_,
                                i = t.segment;
                            if ("function" != typeof p["default"].WebVTT && this.subtitlesTrack_ && this.subtitlesTrack_.tech_) {
                                var n = function() {
                                    var t = function() {
                                        e.handleSegment_()
                                    };
                                    return e.state = "WAITING_ON_VTTJS", e.subtitlesTrack_.tech_.one("vttjsloaded", t), e.subtitlesTrack_.tech_.one("vttjserror", function() {
                                        e.subtitlesTrack_.tech_.off("vttjsloaded", t), e.error({
                                            message: "Error loading vtt.js"
                                        }), e.state = "READY", e.pause(), e.trigger("error")
                                    }), {
                                        v: undefined
                                    }
                                }();
                                if ("object" == typeof n) return n.v
                            }
                            i.requested = !0;
                            try {
                                this.parseVTTCues_(t)
                            } catch (r) {
                                return this.error({
                                    message: r.message
                                }), this.state = "READY", this.pause(), this.trigger("error")
                            }
                            if (this.updateTimeMapping_(t, this.syncController_.timelines[t.timeline], this.playlist_), t.isSyncRequest) return this.trigger("syncinfoupdate"), this.pendingSegment_ = null, void(this.state = "READY");
                            t.byteLength = t.bytes.byteLength, this.mediaSecondsLoaded += i.duration, t.cues.length && this.remove(t.cues[0].endTime, t.cues[t.cues.length - 1].endTime), t.cues.forEach(function(t) {
                                e.subtitlesTrack_.addCue(t)
                            }), this.handleUpdateEnd_()
                        }
                    }, {
                        key: "parseVTTCues_",
                        value: function(e) {
                            var t = undefined,
                                i = !1;
                            "function" == typeof p["default"].TextDecoder ? t = new p["default"].TextDecoder("utf8") : (t = p["default"].WebVTT.StringDecoder(), i = !0);
                            var n = new p["default"].WebVTT.Parser(p["default"], p["default"].vttjs, t);
                            if (e.cues = [], e.timestampmap = {
                                MPEGTS: 0,
                                LOCAL: 0
                            }, n.oncue = e.cues.push.bind(e.cues), n.ontimestampmap = function(t) {
                                return e.timestampmap = t
                            }, n.onparsingerror = function(e) {
                                c["default"].log.warn("Error encountered when parsing cues: " + e.message)
                            }, e.segment.map) {
                                var r = e.segment.map.bytes;
                                i && (r = v(r)), n.parse(r)
                            }
                            var a = e.bytes;
                            i && (a = v(a)), n.parse(a), n.flush()
                        }
                    }, {
                        key: "updateTimeMapping_",
                        value: function(e, t, i) {
                            var n = e.segment;
                            if (t) {
                                if (!e.cues.length) return void(n.empty = !0);
                                var r = e.timestampmap,
                                    a = r.MPEGTS / 9e4 - r.LOCAL + t.mapping;
                                if (e.cues.forEach(function(e) {
                                    e.startTime += a, e.endTime += a
                                }), !i.syncInfo) {
                                    var s = e.cues[0].startTime,
                                        o = e.cues[e.cues.length - 1].startTime;
                                    i.syncInfo = {
                                        mediaSequence: i.mediaSequence + e.mediaIndex,
                                        time: Math.min(s, o - n.duration)
                                    }
                                }
                            }
                        }
                    }]), t
                }(l["default"]);
            i["default"] = b, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    21: [function(e, t, i) {
        (function(e) {
            "use strict";
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var n = "undefined" != typeof window ? window.videojs : void 0 !== e ? e.videojs : null,
                r = function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                }(n),
                a = function() {
                    return function e(t, i) {
                        t = (0, n.mergeOptions)({
                            timeout: 45e3
                        }, t);
                        var a = e.beforeRequest || r["default"].Hls.xhr.beforeRequest;
                        if (a && "function" == typeof a) {
                            var s = a(t);
                            s && (t = s)
                        }
                        var o = (0, n.xhr)(t, function(e, t) {
                                var n = o.response;
                                !e && n && (o.responseTime = Date.now(), o.roundTripTime = o.responseTime - o.requestTime, o.bytesReceived = n.byteLength || n.length, o.bandwidth || (o.bandwidth = Math.floor(o.bytesReceived / o.roundTripTime * 8 * 1e3))), e && "ETIMEDOUT" === e.code && (o.timedout = !0), e || o.aborted || 200 === t.statusCode || 206 === t.statusCode || 0 === t.statusCode || (e = new Error("XHR Failed with a response of: " + (o && (n || o.responseText)))), i(e, o)
                            }),
                            u = o.abort;
                        return o.abort = function() {
                            return o.aborted = !0, u.apply(o, arguments)
                        }, o.uri = t.uri, o.requestTime = Date.now(), o
                    }
                };
            i["default"] = a, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    22: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function() {
                var e = [
                        [
                            [],
                            [],
                            [],
                            [],
                            []
                        ],
                        [
                            [],
                            [],
                            [],
                            [],
                            []
                        ]
                    ],
                    t = e[0],
                    i = e[1],
                    n = t[4],
                    r = i[4],
                    a = undefined,
                    s = undefined,
                    o = undefined,
                    u = [],
                    d = [],
                    l = undefined,
                    f = undefined,
                    c = undefined,
                    h = undefined,
                    p = undefined,
                    m = undefined;
                for (a = 0; a < 256; a++) d[(u[a] = a << 1 ^ 283 * (a >> 7)) ^ a] = a;
                for (s = o = 0; !n[s]; s ^= l || 1, o = d[o] || 1) for (h = o ^ o << 1 ^ o << 2 ^ o << 3 ^ o << 4, h = h >> 8 ^ 255 & h ^ 99, n[s] = h, r[h] = s, c = u[f = u[l = u[s]]], m = 16843009 * c ^ 65537 * f ^ 257 * l ^ 16843008 * s, p = 257 * u[h] ^ 16843008 * h, a = 0; a < 4; a++) t[a][s] = p = p << 24 ^ p >>> 8, i[a][h] = m = m << 24 ^ m >>> 8;
                for (a = 0; a < 5; a++) t[a] = t[a].slice(0), i[a] = i[a].slice(0);
                return e
            }, s = null,
            o = function() {
                function e(t) {
                    n(this, e), s || (s = a()), this._tables = [
                        [s[0][0].slice(), s[0][1].slice(), s[0][2].slice(), s[0][3].slice(), s[0][4].slice()],
                        [s[1][0].slice(), s[1][1].slice(), s[1][2].slice(), s[1][3].slice(), s[1][4].slice()]
                    ];
                    var i = undefined,
                        r = undefined,
                        o = undefined,
                        u = undefined,
                        d = undefined,
                        l = this._tables[0][4],
                        f = this._tables[1],
                        c = t.length,
                        h = 1;
                    if (4 !== c && 6 !== c && 8 !== c) throw new Error("Invalid aes key size");
                    for (u = t.slice(0), d = [], this._key = [u, d], i = c; i < 4 * c + 28; i++) o = u[i - 1], (i % c == 0 || 8 === c && i % c == 4) && (o = l[o >>> 24] << 24 ^ l[o >> 16 & 255] << 16 ^ l[o >> 8 & 255] << 8 ^ l[255 & o], i % c == 0 && (o = o << 8 ^ o >>> 24 ^ h << 24, h = h << 1 ^ 283 * (h >> 7))), u[i] = u[i - c] ^ o;
                    for (r = 0; i; r++, i--) o = u[3 & r ? i : i - 4], d[r] = i <= 4 || r < 4 ? o : f[0][l[o >>> 24]] ^ f[1][l[o >> 16 & 255]] ^ f[2][l[o >> 8 & 255]] ^ f[3][l[255 & o]]
                }
                return r(e, [{
                    key: "decrypt",
                    value: function(e, t, i, n, r, a) {
                        var s = this._key[1],
                            o = e ^ s[0],
                            u = n ^ s[1],
                            d = i ^ s[2],
                            l = t ^ s[3],
                            f = undefined,
                            c = undefined,
                            h = undefined,
                            p = s.length / 4 - 2,
                            m = undefined,
                            g = 4,
                            y = this._tables[1],
                            _ = y[0],
                            v = y[1],
                            b = y[2],
                            T = y[3],
                            S = y[4];
                        for (m = 0; m < p; m++) f = _[o >>> 24] ^ v[u >> 16 & 255] ^ b[d >> 8 & 255] ^ T[255 & l] ^ s[g], c = _[u >>> 24] ^ v[d >> 16 & 255] ^ b[l >> 8 & 255] ^ T[255 & o] ^ s[g + 1], h = _[d >>> 24] ^ v[l >> 16 & 255] ^ b[o >> 8 & 255] ^ T[255 & u] ^ s[g + 2], l = _[l >>> 24] ^ v[o >> 16 & 255] ^ b[u >> 8 & 255] ^ T[255 & d] ^ s[g + 3], g += 4, o = f, u = c, d = h;
                        for (m = 0; m < 4; m++) r[(3 & -m) + a] = S[o >>> 24] << 24 ^ S[u >> 16 & 255] << 16 ^ S[d >> 8 & 255] << 8 ^ S[255 & l] ^ s[g++], f = o, o = u, u = d, d = l, l = f
                    }
                }]), e
            }();
        i["default"] = o, t.exports = i["default"]
    }, {}],
    23: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        function r(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var a = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = function(e, t, i) {
                for (var n = !0; n;) {
                    var r = e,
                        a = t,
                        s = i;
                    n = !1, null === r && (r = Function.prototype);
                    var o = Object.getOwnPropertyDescriptor(r, a);
                    if (o !== undefined) {
                        if ("value" in o) return o.value;
                        var u = o.get;
                        return u === undefined ? undefined : u.call(s)
                    }
                    var d = Object.getPrototypeOf(r);
                    if (null === d) return undefined;
                    e = d, t = a, i = s, n = !0, o = d = undefined
                }
            }, o = e(26),
            u = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(o),
            d = function(e) {
                function t() {
                    n(this, t), s(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, u["default"]), this.jobs = [], this.delay = 1, this.timeout_ = null
                }
                return r(t, e), a(t, [{
                    key: "processJob_",
                    value: function() {
                        this.jobs.shift()(), this.jobs.length ? this.timeout_ = setTimeout(this.processJob_.bind(this), this.delay) : this.timeout_ = null
                    }
                }, {
                    key: "push",
                    value: function(e) {
                        this.jobs.push(e), this.timeout_ || (this.timeout_ = setTimeout(this.processJob_.bind(this), this.delay))
                    }
                }]), t
            }(u["default"]);
        i["default"] = d, t.exports = i["default"]
    }, {}],
    24: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var a = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = e(22),
            o = n(s),
            u = e(23),
            d = n(u),
            l = e(28),
            f = function(e) {
                return e << 24 | (65280 & e) << 8 | (16711680 & e) >> 8 | e >>> 24
            }, c = function(e, t, i) {
                var n = new Int32Array(e.buffer, e.byteOffset, e.byteLength >> 2),
                    r = new o["default"](Array.prototype.slice.call(t)),
                    a = new Uint8Array(e.byteLength),
                    s = new Int32Array(a.buffer),
                    u = undefined,
                    d = undefined,
                    l = undefined,
                    c = undefined,
                    h = undefined,
                    p = undefined,
                    m = undefined,
                    g = undefined,
                    y = undefined;
                for (u = i[0], d = i[1], l = i[2], c = i[3], y = 0; y < n.length; y += 4) h = f(n[y]), p = f(n[y + 1]), m = f(n[y + 2]), g = f(n[y + 3]), r.decrypt(h, p, m, g, s, y), s[y] = f(s[y] ^ u), s[y + 1] = f(s[y + 1] ^ d), s[y + 2] = f(s[y + 2] ^ l), s[y + 3] = f(s[y + 3] ^ c), u = h, d = p, l = m, c = g;
                return a
            };
        i.decrypt = c;
        var h = function() {
            function e(t, i, n, a) {
                r(this, e);
                var s = e.STEP,
                    o = new Int32Array(t.buffer),
                    u = new Uint8Array(t.byteLength),
                    c = 0;
                for (this.asyncStream_ = new d["default"], this.asyncStream_.push(this.decryptChunk_(o.subarray(c, c + s), i, n, u)), c = s; c < o.length; c += s) n = new Uint32Array([f(o[c - 4]), f(o[c - 3]), f(o[c - 2]), f(o[c - 1])]), this.asyncStream_.push(this.decryptChunk_(o.subarray(c, c + s), i, n, u));
                this.asyncStream_.push(function() {
                    a(null, (0, l.unpad)(u))
                })
            }
            return a(e, [{
                key: "decryptChunk_",
                value: function(e, t, i, n) {
                    return function() {
                        var r = c(e, t, i);
                        n.set(r, e.byteOffset)
                    }
                }
            }], [{
                key: "STEP",
                get: function() {
                    return 32e3
                }
            }]), e
        }();
        i.Decrypter = h, i["default"] = {
            Decrypter: h,
            decrypt: c
        }
    }, {}],
    25: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = e(24),
            r = e(23),
            a = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(r);
        i["default"] = {
            decrypt: n.decrypt,
            Decrypter: n.Decrypter,
            AsyncStream: a["default"]
        }, t.exports = i["default"]
    }, {}],
    26: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function() {
                function e() {
                    n(this, e), this.listeners = {}
                }
                return r(e, [{
                    key: "on",
                    value: function(e, t) {
                        this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t)
                    }
                }, {
                    key: "off",
                    value: function(e, t) {
                        var i = undefined;
                        return !!this.listeners[e] && (i = this.listeners[e].indexOf(t), this.listeners[e].splice(i, 1), i > -1)
                    }
                }, {
                    key: "trigger",
                    value: function(e) {
                        var t = undefined,
                            i = undefined,
                            n = undefined,
                            r = undefined;
                        if (t = this.listeners[e]) if (2 === arguments.length) for (n = t.length, i = 0; i < n; ++i) t[i].call(this, arguments[1]);
                        else for (r = Array.prototype.slice.call(arguments, 1), n = t.length, i = 0; i < n; ++i) t[i].apply(this, r)
                    }
                }, {
                    key: "dispose",
                    value: function() {
                        this.listeners = {}
                    }
                }, {
                    key: "pipe",
                    value: function(e) {
                        this.on("data", function(t) {
                            e.push(t)
                        })
                    }
                }]), e
            }();
        i["default"] = a, t.exports = i["default"]
    }, {}],
    27: [function(e, t, i) {
        "use strict";
        var n;
        t.exports = function(e) {
            var t = n[e.byteLength % 16 || 0],
                i = new Uint8Array(e.byteLength + t.length);
            return i.set(e), i.set(t, e.byteLength), i
        }, n = [
            [16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16],
            [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15],
            [14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
            [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
            [12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
            [11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11],
            [10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [9, 9, 9, 9, 9, 9, 9, 9, 9],
            [8, 8, 8, 8, 8, 8, 8, 8],
            [7, 7, 7, 7, 7, 7, 7],
            [6, 6, 6, 6, 6, 6],
            [5, 5, 5, 5, 5],
            [4, 4, 4, 4],
            [3, 3, 3],
            [2, 2],
            [1]
        ]
    }, {}],
    28: [function(e, t, i) {
        "use strict";
        i.pad = e(27), i.unpad = e(29)
    }, {}],
    29: [function(e, t, i) {
        "use strict";
        t.exports = function(e) {
            return e.subarray(0, e.byteLength - e[e.byteLength - 1])
        }
    }, {}],
    30: [function(e, t, i) {}, {}],
    31: [function(e, t, i) {
        (function(i) {
            var n, r = void 0 !== i ? i : "undefined" != typeof window ? window : {}, a = e(30);
            "undefined" != typeof document ? n = document : (n = r["__GLOBAL_DOCUMENT_CACHE@4"]) || (n = r["__GLOBAL_DOCUMENT_CACHE@4"] = a), t.exports = n
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    32: [function(e, t, i) {
        (function(e) {
            var i;
            i = "undefined" != typeof window ? window : void 0 !== e ? e : "undefined" != typeof self ? self : {}, t.exports = i
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    33: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        var r = e(34),
            a = n(r),
            s = e(35),
            o = n(s),
            u = e(36),
            d = n(u);
        t.exports = {
            LineStream: a["default"],
            ParseStream: o["default"],
            Parser: d["default"]
        }
    }, {}],
    34: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }
        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var s = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            o = e(37),
            u = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(o),
            d = function(e) {
                function t() {
                    n(this, t);
                    var e = r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    return e.buffer = "", e
                }
                return a(t, e), s(t, [{
                    key: "push",
                    value: function(e) {
                        var t = void 0;
                        for (this.buffer += e, t = this.buffer.indexOf("\n"); t > -1; t = this.buffer.indexOf("\n")) this.trigger("data", this.buffer.substring(0, t)), this.buffer = this.buffer.substring(t + 1)
                    }
                }]), t
            }(u["default"]);
        i["default"] = d
    }, {}],
    35: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        function r(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }
        function a(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var s = function() {
                function e(e, t) {
                    var i = [],
                        n = !0,
                        r = !1,
                        a = undefined;
                    try {
                        for (var s, o = e[Symbol.iterator](); !(n = (s = o.next()).done) && (i.push(s.value), !t || i.length !== t); n = !0);
                    } catch (u) {
                        r = !0, a = u
                    } finally {
                        try {
                            !n && o["return"] && o["return"]()
                        } finally {
                            if (r) throw a
                        }
                    }
                    return i
                }
                return function(t, i) {
                    if (Array.isArray(t)) return t;
                    if (Symbol.iterator in Object(t)) return e(t, i);
                    throw new TypeError("Invalid attempt to destructure non-iterable instance")
                }
            }(),
            o = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            u = e(37),
            d = function(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }(u),
            l = function() {
                return new RegExp('(?:^|,)((?:[^=]*)=(?:"[^"]*"|[^,]*))')
            }, f = function(e) {
                for (var t = e.split(l()), i = {}, n = t.length, r = void 0; n--;) "" !== t[n] && (r = /([^=]*)=(.*)/.exec(t[n]).slice(1), r[0] = r[0].replace(/^\s+|\s+$/g, ""), r[1] = r[1].replace(/^\s+|\s+$/g, ""), r[1] = r[1].replace(/^['"](.*)['"]$/g, "$1"), i[r[0]] = r[1]);
                return i
            }, c = function(e) {
                function t() {
                    return n(this, t), r(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this))
                }
                return a(t, e), o(t, [{
                    key: "push",
                    value: function(e) {
                        var t = void 0,
                            i = void 0;
                        if (e = e.replace(/^[\u0000\s]+|[\u0000\s]+$/g, ""), 0 !== e.length) {
                            if ("#" !== e[0]) return void this.trigger("data", {
                                type: "uri",
                                uri: e
                            });
                            if (0 !== e.indexOf("#EXT")) return void this.trigger("data", {
                                type: "comment",
                                text: e.slice(1)
                            });
                            if (e = e.replace("\r", ""), t = /^#EXTM3U/.exec(e)) return void this.trigger("data", {
                                type: "tag",
                                tagType: "m3u"
                            });
                            if (t = /^#EXTINF:?([0-9\.]*)?,?(.*)?$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "inf"
                            }, t[1] && (i.duration = parseFloat(t[1])), t[2] && (i.title = t[2]), void this.trigger("data", i);
                            if (t = /^#EXT-X-TARGETDURATION:?([0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "targetduration"
                            }, t[1] && (i.duration = parseInt(t[1], 10)), void this.trigger("data", i);
                            if (t = /^#ZEN-TOTAL-DURATION:?([0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "totalduration"
                            }, t[1] && (i.duration = parseInt(t[1], 10)), void this.trigger("data", i);
                            if (t = /^#EXT-X-VERSION:?([0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "version"
                            }, t[1] && (i.version = parseInt(t[1], 10)), void this.trigger("data", i);
                            if (t = /^#EXT-X-MEDIA-SEQUENCE:?(\-?[0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "media-sequence"
                            }, t[1] && (i.number = parseInt(t[1], 10)), void this.trigger("data", i);
                            if (t = /^#EXT-X-DISCONTINUITY-SEQUENCE:?(\-?[0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "discontinuity-sequence"
                            }, t[1] && (i.number = parseInt(t[1], 10)), void this.trigger("data", i);
                            if (t = /^#EXT-X-PLAYLIST-TYPE:?(.*)?$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "playlist-type"
                            }, t[1] && (i.playlistType = t[1]), void this.trigger("data", i);
                            if (t = /^#EXT-X-BYTERANGE:?([0-9.]*)?@?([0-9.]*)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "byterange"
                            }, t[1] && (i.length = parseInt(t[1], 10)), t[2] && (i.offset = parseInt(t[2], 10)), void this.trigger("data", i);
                            if (t = /^#EXT-X-ALLOW-CACHE:?(YES|NO)?/.exec(e)) return i = {
                                type: "tag",
                                tagType: "allow-cache"
                            }, t[1] && (i.allowed = !/NO/.test(t[1])), void this.trigger("data", i);
                            if (t = /^#EXT-X-MAP:?(.*)$/.exec(e)) {
                                if (i = {
                                    type: "tag",
                                    tagType: "map"
                                }, t[1]) {
                                    var n = f(t[1]);
                                    if (n.URI && (i.uri = n.URI), n.BYTERANGE) {
                                        var r = n.BYTERANGE.split("@"),
                                            a = s(r, 2),
                                            o = a[0],
                                            u = a[1];
                                        i.byterange = {}, o && (i.byterange.length = parseInt(o, 10)), u && (i.byterange.offset = parseInt(u, 10))
                                    }
                                }
                                return void this.trigger("data", i)
                            }
                            if (t = /^#EXT-X-STREAM-INF:?(.*)$/.exec(e)) {
                                if (i = {
                                    type: "tag",
                                    tagType: "stream-inf"
                                }, t[1]) {
                                    if (i.attributes = f(t[1]), i.attributes.RESOLUTION) {
                                        var d = i.attributes.RESOLUTION.split("x"),
                                            l = {};
                                        d[0] && (l.width = parseInt(d[0], 10)), d[1] && (l.height = parseInt(d[1], 10)), i.attributes.RESOLUTION = l
                                    }
                                    i.attributes.BANDWIDTH && (i.attributes.BANDWIDTH = parseInt(i.attributes.BANDWIDTH, 10)), i.attributes["PROGRAM-ID"] && (i.attributes["PROGRAM-ID"] = parseInt(i.attributes["PROGRAM-ID"], 10))
                                }
                                return void this.trigger("data", i)
                            }
                            if (t = /^#EXT-X-MEDIA:?(.*)$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "media"
                            }, t[1] && (i.attributes = f(t[1])), void this.trigger("data", i);
                            if (t = /^#EXT-X-ENDLIST/.exec(e)) return void this.trigger("data", {
                                type: "tag",
                                tagType: "endlist"
                            });
                            if (t = /^#EXT-X-DISCONTINUITY/.exec(e)) return void this.trigger("data", {
                                type: "tag",
                                tagType: "discontinuity"
                            });
                            if (t = /^#EXT-X-PROGRAM-DATE-TIME:?(.*)$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "program-date-time"
                            }, t[1] && (i.dateTimeString = t[1], i.dateTimeObject = new Date(t[1])), void this.trigger("data", i);
                            if (t = /^#EXT-X-KEY:?(.*)$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "key"
                            }, t[1] && (i.attributes = f(t[1]), i.attributes.IV && ("0x" === i.attributes.IV.substring(0, 2).toLowerCase() && (i.attributes.IV = i.attributes.IV.substring(2)), i.attributes.IV = i.attributes.IV.match(/.{8}/g), i.attributes.IV[0] = parseInt(i.attributes.IV[0], 16), i.attributes.IV[1] = parseInt(i.attributes.IV[1], 16), i.attributes.IV[2] = parseInt(i.attributes.IV[2], 16), i.attributes.IV[3] = parseInt(i.attributes.IV[3], 16), i.attributes.IV = new Uint32Array(i.attributes.IV))), void this.trigger("data", i);
                            if (t = /^#EXT-X-CUE-OUT-CONT:?(.*)?$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "cue-out-cont"
                            }, t[1] ? i.data = t[1] : i.data = "", void this.trigger("data", i);
                            if (t = /^#EXT-X-CUE-OUT:?(.*)?$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "cue-out"
                            }, t[1] ? i.data = t[1] : i.data = "", void this.trigger("data", i);
                            if (t = /^#EXT-X-CUE-IN:?(.*)?$/.exec(e)) return i = {
                                type: "tag",
                                tagType: "cue-in"
                            }, t[1] ? i.data = t[1] : i.data = "", void this.trigger("data", i);
                            this.trigger("data", {
                                type: "tag",
                                data: e.slice(4)
                            })
                        }
                    }
                }]), t
            }(d["default"]);
        i["default"] = c
    }, {}],
    36: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        function a(e, t) {
            if (!e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
            return !t || "object" != typeof t && "function" != typeof t ? e : t
        }
        function s(e, t) {
            if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
            e.prototype = Object.create(t && t.prototype, {
                constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                }
            }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var o = Object.assign || function(e) {
                for (var t = 1; t < arguments.length; t++) {
                    var i = arguments[t];
                    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n])
                }
                return e
            }, u = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            d = e(37),
            l = n(d),
            f = e(34),
            c = n(f),
            h = e(35),
            p = n(h),
            m = function(e) {
                function t() {
                    r(this, t);
                    var e = a(this, (t.__proto__ || Object.getPrototypeOf(t)).call(this));
                    e.lineStream = new c["default"], e.parseStream = new p["default"], e.lineStream.pipe(e.parseStream);
                    var i = e,
                        n = [],
                        s = {}, u = void 0,
                        d = void 0,
                        l = function() {}, f = {
                            AUDIO: {},
                            VIDEO: {},
                            "CLOSED-CAPTIONS": {},
                            SUBTITLES: {}
                        }, h = 0;
                    return e.manifest = {
                        allowCache: !0,
                        discontinuityStarts: [],
                        segments: []
                    }, e.parseStream.on("data", function(e) {
                        var t = void 0,
                            r = void 0;
                        ({
                            tag: function() {
                                (({
                                    "allow-cache": function() {
                                        this.manifest.allowCache = e.allowed, "allowed" in e || (this.trigger("info", {
                                            message: "defaulting allowCache to YES"
                                        }), this.manifest.allowCache = !0)
                                    },
                                    byterange: function() {
                                        var t = {};
                                        "length" in e && (s.byterange = t, t.length = e.length, "offset" in e || (this.trigger("info", {
                                            message: "defaulting offset to zero"
                                        }), e.offset = 0)), "offset" in e && (s.byterange = t, t.offset = e.offset)
                                    },
                                    endlist: function() {
                                        this.manifest.endList = !0
                                    },
                                    inf: function() {
                                        "mediaSequence" in this.manifest || (this.manifest.mediaSequence = 0, this.trigger("info", {
                                            message: "defaulting media sequence to zero"
                                        })), "discontinuitySequence" in this.manifest || (this.manifest.discontinuitySequence = 0, this.trigger("info", {
                                            message: "defaulting discontinuity sequence to zero"
                                        })), e.duration > 0 && (s.duration = e.duration), 0 === e.duration && (s.duration = .01, this.trigger("info", {
                                            message: "updating zero segment duration to a small value"
                                        })), this.manifest.segments = n
                                    },
                                    key: function() {
                                        return e.attributes ? "NONE" === e.attributes.METHOD ? void(d = null) : e.attributes.URI ? (e.attributes.METHOD || this.trigger("warn", {
                                            message: "defaulting key method to AES-128"
                                        }), d = {
                                            method: e.attributes.METHOD || "AES-128",
                                            uri: e.attributes.URI
                                        }, void("undefined" != typeof e.attributes.IV && (d.iv = e.attributes.IV))) : void this.trigger("warn", {
                                            message: "ignoring key declaration without URI"
                                        }) : void this.trigger("warn", {
                                            message: "ignoring key declaration without attribute list"
                                        })
                                    },
                                    "media-sequence": function() {
                                        if (!isFinite(e.number)) return void this.trigger("warn", {
                                            message: "ignoring invalid media sequence: " + e.number
                                        });
                                        this.manifest.mediaSequence = e.number
                                    },
                                    "discontinuity-sequence": function() {
                                        if (!isFinite(e.number)) return void this.trigger("warn", {
                                            message: "ignoring invalid discontinuity sequence: " + e.number
                                        });
                                        this.manifest.discontinuitySequence = e.number, h = e.number
                                    },
                                    "playlist-type": function() {
                                        if (!/VOD|EVENT/.test(e.playlistType)) return void this.trigger("warn", {
                                            message: "ignoring unknown playlist type: " + e.playlist
                                        });
                                        this.manifest.playlistType = e.playlistType
                                    },
                                    map: function() {
                                        u = {}, e.uri && (u.uri = e.uri), e.byterange && (u.byterange = e.byterange)
                                    },
                                    "stream-inf": function() {
                                        if (this.manifest.playlists = n, this.manifest.mediaGroups = this.manifest.mediaGroups || f, !e.attributes) return void this.trigger("warn", {
                                            message: "ignoring empty stream-inf attributes"
                                        });
                                        s.attributes || (s.attributes = {}), o(s.attributes, e.attributes)
                                    },
                                    media: function() {
                                        if (this.manifest.mediaGroups = this.manifest.mediaGroups || f, !(e.attributes && e.attributes.TYPE && e.attributes["GROUP-ID"] && e.attributes.NAME)) return void this.trigger("warn", {
                                            message: "ignoring incomplete or missing media group"
                                        });
                                        var i = this.manifest.mediaGroups[e.attributes.TYPE];
                                        i[e.attributes["GROUP-ID"]] = i[e.attributes["GROUP-ID"]] || {}, t = i[e.attributes["GROUP-ID"]], r = {
                                            "default": /yes/i.test(e.attributes.DEFAULT)
                                        }, r["default"] ? r.autoselect = !0 : r.autoselect = /yes/i.test(e.attributes.AUTOSELECT), e.attributes.LANGUAGE && (r.language = e.attributes.LANGUAGE), e.attributes.URI && (r.uri = e.attributes.URI), e.attributes["INSTREAM-ID"] && (r.instreamId = e.attributes["INSTREAM-ID"]), e.attributes.CHARACTERISTICS && (r.characteristics = e.attributes.CHARACTERISTICS), e.attributes.FORCED && (r.forced = /yes/i.test(e.attributes.FORCED)), t[e.attributes.NAME] = r
                                    },
                                    discontinuity: function() {
                                        h += 1, s.discontinuity = !0, this.manifest.discontinuityStarts.push(n.length)
                                    },
                                    "program-date-time": function() {
                                        this.manifest.dateTimeString = e.dateTimeString, this.manifest.dateTimeObject = e.dateTimeObject
                                    },
                                    targetduration: function() {
                                        if (!isFinite(e.duration) || e.duration < 0) return void this.trigger("warn", {
                                            message: "ignoring invalid target duration: " + e.duration
                                        });
                                        this.manifest.targetDuration = e.duration
                                    },
                                    totalduration: function() {
                                        if (!isFinite(e.duration) || e.duration < 0) return void this.trigger("warn", {
                                            message: "ignoring invalid total duration: " + e.duration
                                        });
                                        this.manifest.totalDuration = e.duration
                                    },
                                    "cue-out": function() {
                                        s.cueOut = e.data
                                    },
                                    "cue-out-cont": function() {
                                        s.cueOutCont = e.data
                                    },
                                    "cue-in": function() {
                                        s.cueIn = e.data
                                    }
                                })[e.tagType] || l).call(i)
                            },
                            uri: function() {
                                s.uri = e.uri, n.push(s), !this.manifest.targetDuration || "duration" in s || (this.trigger("warn", {
                                    message: "defaulting segment duration to the target duration"
                                }), s.duration = this.manifest.targetDuration), d && (s.key = d), s.timeline = h, u && (s.map = u), s = {}
                            },
                            comment: function() {}
                        })[e.type].call(i)
                    }), e
                }
                return s(t, e), u(t, [{
                    key: "push",
                    value: function(e) {
                        this.lineStream.push(e)
                    }
                }, {
                    key: "end",
                    value: function() {
                        this.lineStream.push("\n")
                    }
                }]), t
            }(l["default"]);
        i["default"] = m
    }, {}],
    37: [function(e, t, i) {
        "use strict";

        function n(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var r = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            a = function() {
                function e() {
                    n(this, e), this.listeners = {}
                }
                return r(e, [{
                    key: "on",
                    value: function(e, t) {
                        this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t)
                    }
                }, {
                    key: "off",
                    value: function(e, t) {
                        if (!this.listeners[e]) return !1;
                        var i = this.listeners[e].indexOf(t);
                        return this.listeners[e].splice(i, 1), i > -1
                    }
                }, {
                    key: "trigger",
                    value: function(e) {
                        var t = this.listeners[e],
                            i = void 0,
                            n = void 0,
                            r = void 0;
                        if (t) if (2 === arguments.length) for (n = t.length, i = 0; i < n; ++i) t[i].call(this, arguments[1]);
                        else for (r = Array.prototype.slice.call(arguments, 1), n = t.length, i = 0; i < n; ++i) t[i].apply(this, r)
                    }
                }, {
                    key: "dispose",
                    value: function() {
                        this.listeners = {}
                    }
                }, {
                    key: "pipe",
                    value: function(e) {
                        this.on("data", function(t) {
                            e.push(t)
                        })
                    }
                }]), e
            }();
        i["default"] = a
    }, {}],
    38: [function(e, t, i) {
        "use strict";
        var n, r = e(62);
        n = function() {
            var e = new Uint8Array,
                t = 0;
            n.prototype.init.call(this), this.setTimestamp = function(e) {
                t = e
            }, this.parseId3TagSize = function(e, t) {
                var i = e[t + 6] << 21 | e[t + 7] << 14 | e[t + 8] << 7 | e[t + 9];
                return (16 & e[t + 5]) >> 4 ? i + 20 : i + 10
            }, this.parseAdtsSize = function(e, t) {
                var i = (224 & e[t + 5]) >> 5,
                    n = e[t + 4] << 3;
                return 6144 & e[t + 3] | n | i
            }, this.push = function(i) {
                var n, r, a, s, o = 0,
                    u = 0;
                for (e.length ? (s = e.length, e = new Uint8Array(i.byteLength + s), e.set(e.subarray(0, s)), e.set(i, s)) : e = i; e.length - u >= 3;) if (e[u] !== "I".charCodeAt(0) || e[u + 1] !== "D".charCodeAt(0) || e[u + 2] !== "3".charCodeAt(0)) if (!0 & e[u] && 240 == (240 & e[u + 1])) {
                    if (e.length - u < 7) break;
                    if ((o = this.parseAdtsSize(e, u)) > e.length) break;
                    a = {
                        type: "audio",
                        data: e.subarray(u, u + o),
                        pts: t,
                        dts: t
                    }, this.trigger("data", a), u += o
                } else u++;
                else {
                    if (e.length - u < 10) break;
                    if ((o = this.parseId3TagSize(e, u)) > e.length) break;
                    r = {
                        type: "timed-metadata",
                        data: e.subarray(u, u + o)
                    }, this.trigger("data", r), u += o
                }
                n = e.length - u, e = n > 0 ? e.subarray(u) : new Uint8Array
            }
        }, n.prototype = new r, t.exports = n
    }, {}],
    39: [function(e, t, i) {
        "use strict";
        var n = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350],
            r = function(e) {
                return e[0] << 21 | e[1] << 14 | e[2] << 7 | e[3]
            }, a = function(e, t, i) {
                var n, r = "";
                for (n = t; n < i; n++) r += "%" + ("00" + e[n].toString(16)).slice(-2);
                return r
            }, s = function(e, t, i) {
                return unescape(a(e, t, i))
            }, o = function(e, t) {
                var i = e[t + 6] << 21 | e[t + 7] << 14 | e[t + 8] << 7 | e[t + 9];
                return (16 & e[t + 5]) >> 4 ? i + 20 : i + 10
            }, u = function(e, t) {
                var i = (224 & e[t + 5]) >> 5,
                    n = e[t + 4] << 3;
                return 6144 & e[t + 3] | n | i
            }, d = function(e, t) {
                return e[t] === "I".charCodeAt(0) && e[t + 1] === "D".charCodeAt(0) && e[t + 2] === "3".charCodeAt(0) ? "timed-metadata" : !0 & e[t] && 240 == (240 & e[t + 1]) ? "audio" : null
            }, l = function(e) {
                for (var t = 0; t + 5 < e.length;) {
                    if (255 === e[t] && 240 == (246 & e[t + 1])) return n[(60 & e[t + 2]) >>> 2];
                    t++
                }
                return null
            }, f = function(e) {
                var t, i, n;
                t = 10, 64 & e[5] && (t += 4, t += r(e.subarray(10, 14)));
                do {
                    if ((i = r(e.subarray(t + 4, t + 8))) < 1) return null;
                    if ("PRIV" === String.fromCharCode(e[t], e[t + 1], e[t + 2], e[t + 3])) {
                        n = e.subarray(t + 10, t + i + 10);
                        for (var a = 0; a < n.byteLength; a++) if (0 === n[a]) {
                            var o = s(n, 0, a);
                            if ("com.apple.streaming.transportStreamTimestamp" === o) {
                                var u = n.subarray(a + 1),
                                    d = (1 & u[3]) << 30 | u[4] << 22 | u[5] << 14 | u[6] << 6 | u[7] >>> 2;
                                return d *= 4, d += 3 & u[7]
                            }
                            break
                        }
                    }
                    t += 10, t += i
                } while (t < e.byteLength);
                return null
            };
        t.exports = {
            parseId3TagSize: o,
            parseAdtsSize: u,
            parseType: d,
            parseSampleRate: l,
            parseAacTimestamp: f
        }
    }, {}],
    40: [function(e, t, i) {
        "use strict";
        var n, r = e(62),
            a = [96e3, 88200, 64e3, 48e3, 44100, 32e3, 24e3, 22050, 16e3, 12e3, 11025, 8e3, 7350];
        n = function() {
            var e;
            n.prototype.init.call(this), this.push = function(t) {
                var i, n, r, s, o, u, d = 0,
                    l = 0;
                if ("audio" === t.type) for (e ? (s = e, e = new Uint8Array(s.byteLength + t.data.byteLength), e.set(s), e.set(t.data, s.byteLength)) : e = t.data; d + 5 < e.length;) if (255 === e[d] && 240 == (246 & e[d + 1])) {
                    if (n = 2 * (1 & ~e[d + 1]), i = (3 & e[d + 3]) << 11 | e[d + 4] << 3 | (224 & e[d + 5]) >> 5, o = 1024 * (1 + (3 & e[d + 6])), u = 9e4 * o / a[(60 & e[d + 2]) >>> 2], r = d + i, e.byteLength < r) return;
                    if (this.trigger("data", {
                        pts: t.pts + l * u,
                        dts: t.dts + l * u,
                        sampleCount: o,
                        audioobjecttype: 1 + (e[d + 2] >>> 6 & 3),
                        channelcount: (1 & e[d + 2]) << 2 | (192 & e[d + 3]) >>> 6,
                        samplerate: a[(60 & e[d + 2]) >>> 2],
                        samplingfrequencyindex: (60 & e[d + 2]) >>> 2,
                        samplesize: 16,
                        data: e.subarray(d + 7 + n, r)
                    }), e.byteLength === r) return void(e = undefined);
                    l++, e = e.subarray(r)
                } else d++
            }, this.flush = function() {
                this.trigger("done")
            }
        }, n.prototype = new r, t.exports = n
    }, {}],
    41: [function(e, t, i) {
        "use strict";
        var n, r, a, s = e(62),
            o = e(61);
        r = function() {
            var e, t, i = 0;
            r.prototype.init.call(this), this.push = function(n) {
                var r;
                for (t ? (r = new Uint8Array(t.byteLength + n.data.byteLength), r.set(t), r.set(n.data, t.byteLength), t = r) : t = n.data; i < t.byteLength - 3; i++) if (1 === t[i + 2]) {
                    e = i + 5;
                    break
                }
                for (; e < t.byteLength;) switch (t[e]) {
                    case 0:
                        if (0 !== t[e - 1]) {
                            e += 2;
                            break
                        }
                        if (0 !== t[e - 2]) {
                            e++;
                            break
                        }
                        i + 3 !== e - 2 && this.trigger("data", t.subarray(i + 3, e - 2));
                        do {
                            e++
                        } while (1 !== t[e] && e < t.length);
                        i = e - 2, e += 3;
                        break;
                    case 1:
                        if (0 !== t[e - 1] || 0 !== t[e - 2]) {
                            e += 3;
                            break
                        }
                        this.trigger("data", t.subarray(i + 3, e - 2)), i = e - 2, e += 3;
                        break;
                    default:
                        e += 3
                }
                t = t.subarray(i), e -= i, i = 0
            }, this.flush = function() {
                t && t.byteLength > 3 && this.trigger("data", t.subarray(i + 3)), t = null, i = 0, this.trigger("done")
            }
        }, r.prototype = new s, a = {
            100: !0,
            110: !0,
            122: !0,
            244: !0,
            44: !0,
            83: !0,
            86: !0,
            118: !0,
            128: !0,
            138: !0,
            139: !0,
            134: !0
        }, n = function() {
            var e, t, i, s, u, d, l, f = new r;
            n.prototype.init.call(this), e = this, this.push = function(e) {
                "video" === e.type && (t = e.trackId, i = e.pts, s = e.dts, f.push(e))
            }, f.on("data", function(n) {
                var r = {
                    trackId: t,
                    pts: i,
                    dts: s,
                    data: n
                };
                switch (31 & n[0]) {
                    case 5:
                        r.nalUnitType = "slice_layer_without_partitioning_rbsp_idr";
                        break;
                    case 6:
                        r.nalUnitType = "sei_rbsp", r.escapedRBSP = u(n.subarray(1));
                        break;
                    case 7:
                        r.nalUnitType = "seq_parameter_set_rbsp", r.escapedRBSP = u(n.subarray(1)), r.config = d(r.escapedRBSP);
                        break;
                    case 8:
                        r.nalUnitType = "pic_parameter_set_rbsp";
                        break;
                    case 9:
                        r.nalUnitType = "access_unit_delimiter_rbsp"
                }
                e.trigger("data", r)
            }), f.on("done", function() {
                e.trigger("done")
            }), this.flush = function() {
                f.flush()
            }, l = function(e, t) {
                var i, n, r = 8,
                    a = 8;
                for (i = 0; i < e; i++) 0 !== a && (n = t.readExpGolomb(), a = (r + n + 256) % 256), r = 0 === a ? r : a
            }, u = function(e) {
                for (var t, i, n = e.byteLength, r = [], a = 1; a < n - 2;) 0 === e[a] && 0 === e[a + 1] && 3 === e[a + 2] ? (r.push(a + 2), a += 2) : a++;
                if (0 === r.length) return e;
                t = n - r.length, i = new Uint8Array(t);
                var s = 0;
                for (a = 0; a < t; s++, a++) s === r[0] && (s++, r.shift()), i[a] = e[s];
                return i
            }, d = function(e) {
                var t, i, n, r, s, u, d, f, c, h, p, m, g, y = 0,
                    _ = 0,
                    v = 0,
                    b = 0,
                    T = 1;
                if (t = new o(e), i = t.readUnsignedByte(), r = t.readUnsignedByte(), n = t.readUnsignedByte(), t.skipUnsignedExpGolomb(), a[i] && (s = t.readUnsignedExpGolomb(), 3 === s && t.skipBits(1), t.skipUnsignedExpGolomb(), t.skipUnsignedExpGolomb(), t.skipBits(1), t.readBoolean())) for (p = 3 !== s ? 8 : 12, g = 0; g < p; g++) t.readBoolean() && (g < 6 ? l(16, t) : l(64, t));
                if (t.skipUnsignedExpGolomb(), 0 === (u = t.readUnsignedExpGolomb())) t.readUnsignedExpGolomb();
                else if (1 === u) for (t.skipBits(1), t.skipExpGolomb(), t.skipExpGolomb(), d = t.readUnsignedExpGolomb(), g = 0; g < d; g++) t.skipExpGolomb();
                if (t.skipUnsignedExpGolomb(), t.skipBits(1), f = t.readUnsignedExpGolomb(), c = t.readUnsignedExpGolomb(), h = t.readBits(1), 0 === h && t.skipBits(1), t.skipBits(1), t.readBoolean() && (y = t.readUnsignedExpGolomb(), _ = t.readUnsignedExpGolomb(), v = t.readUnsignedExpGolomb(), b = t.readUnsignedExpGolomb()), t.readBoolean() && t.readBoolean()) {
                    switch (t.readUnsignedByte()) {
                        case 1:
                            m = [1, 1];
                            break;
                        case 2:
                            m = [12, 11];
                            break;
                        case 3:
                            m = [10, 11];
                            break;
                        case 4:
                            m = [16, 11];
                            break;
                        case 5:
                            m = [40, 33];
                            break;
                        case 6:
                            m = [24, 11];
                            break;
                        case 7:
                            m = [20, 11];
                            break;
                        case 8:
                            m = [32, 11];
                            break;
                        case 9:
                            m = [80, 33];
                            break;
                        case 10:
                            m = [18, 11];
                            break;
                        case 11:
                            m = [15, 11];
                            break;
                        case 12:
                            m = [64, 33];
                            break;
                        case 13:
                            m = [160, 99];
                            break;
                        case 14:
                            m = [4, 3];
                            break;
                        case 15:
                            m = [3, 2];
                            break;
                        case 16:
                            m = [2, 1];
                            break;
                        case 255:
                            m = [t.readUnsignedByte() << 8 | t.readUnsignedByte(), t.readUnsignedByte() << 8 | t.readUnsignedByte()]
                    }
                    m && (T = m[0] / m[1])
                }
                return {
                    profileIdc: i,
                    levelIdc: n,
                    profileCompatibility: r,
                    width: Math.ceil((16 * (f + 1) - 2 * y - 2 * _) * T),
                    height: (2 - h) * (c + 1) * 16 - 2 * v - 2 * b
                }
            }
        }, n.prototype = new s, t.exports = {
            H264Stream: n,
            NalByteStream: r
        }
    }, {}],
    42: [function(e, t, i) {
        var n = [33, 16, 5, 32, 164, 27],
            r = [33, 65, 108, 84, 1, 2, 4, 8, 168, 2, 4, 8, 17, 191, 252],
            a = function(e) {
                for (var t = []; e--;) t.push(0);
                return t
            }, s = {
                96e3: [n, [227, 64], a(154), [56]],
                88200: [n, [231], a(170), [56]],
                64e3: [n, [248, 192], a(240), [56]],
                48e3: [n, [255, 192], a(268), [55, 148, 128], a(54), [112]],
                44100: [n, [255, 192], a(268), [55, 163, 128], a(84), [112]],
                32e3: [n, [255, 192], a(268), [55, 234], a(226), [112]],
                24e3: [n, [255, 192], a(268), [55, 255, 128], a(268), [111, 112], a(126), [224]],
                16e3: [n, [255, 192], a(268), [55, 255, 128], a(268), [111, 255], a(269), [223, 108], a(195), [1, 192]],
                12e3: [r, a(268), [3, 127, 248], a(268), [6, 255, 240], a(268), [13, 255, 224], a(268), [27, 253, 128], a(259), [56]],
                11025: [r, a(268), [3, 127, 248], a(268), [6, 255, 240], a(268), [13, 255, 224], a(268), [27, 255, 192], a(268), [55, 175, 128], a(108), [112]],
                8e3: [r, a(268), [3, 121, 16], a(47), [7]]
            };
        t.exports = function(e) {
            return Object.keys(e).reduce(function(t, i) {
                return t[i] = new Uint8Array(e[i].reduce(function(e, t) {
                    return e.concat(t)
                }, [])), t
            }, {})
        }(s)
    }, {}],
    43: [function(e, t, i) {
        "use strict";
        var n = e(62),
            r = function(e) {
                this.numberOfTracks = 0, this.metadataStream = e.metadataStream, this.videoTags = [], this.audioTags = [], this.videoTrack = null, this.audioTrack = null, this.pendingCaptions = [], this.pendingMetadata = [], this.pendingTracks = 0, this.processedTracks = 0, r.prototype.init.call(this), this.push = function(e) {
                    return e.text ? this.pendingCaptions.push(e) : e.frames ? this.pendingMetadata.push(e) : ("video" === e.track.type && (this.videoTrack = e.track, this.videoTags = e.tags, this.pendingTracks++), void("audio" === e.track.type && (this.audioTrack = e.track, this.audioTags = e.tags, this.pendingTracks++)))
                }
            };
        r.prototype = new n, r.prototype.flush = function(e) {
            var t, i, n, r, a = {
                tags: {},
                captions: [],
                captionStreams: {},
                metadata: []
            };
            if (this.pendingTracks < this.numberOfTracks) {
                if ("VideoSegmentStream" !== e && "AudioSegmentStream" !== e) return;
                if (0 === this.pendingTracks && ++this.processedTracks < this.numberOfTracks) return
            }
            if (this.processedTracks += this.pendingTracks, this.pendingTracks = 0, !(this.processedTracks < this.numberOfTracks)) {
                for (this.videoTrack ? r = this.videoTrack.timelineStartInfo.pts : this.audioTrack && (r = this.audioTrack.timelineStartInfo.pts), a.tags.videoTags = this.videoTags, a.tags.audioTags = this.audioTags, n = 0; n < this.pendingCaptions.length; n++) i = this.pendingCaptions[n], i.startTime = i.startPts - r, i.startTime /= 9e4, i.endTime = i.endPts - r, i.endTime /= 9e4, a.captionStreams[i.stream] = !0, a.captions.push(i);
                for (n = 0; n < this.pendingMetadata.length; n++) t = this.pendingMetadata[n], t.cueTime = t.pts - r, t.cueTime /= 9e4, a.metadata.push(t);
                a.metadata.dispatchType = this.metadataStream.dispatchType, this.videoTrack = null, this.audioTrack = null, this.videoTags = [], this.audioTags = [], this.pendingCaptions.length = 0, this.pendingMetadata.length = 0, this.pendingTracks = 0, this.processedTracks = 0, this.trigger("data", a), this.trigger("done")
            }
        }, t.exports = r
    }, {}],
    44: [function(e, t, i) {
        "use strict";
        var n = e(45),
            r = function(e, t, i) {
                var r, a, s, o = new Uint8Array(9),
                    u = new DataView(o.buffer);
                return e = e || 0, t = t === undefined || t, i = i === undefined || i, u.setUint8(0, 70), u.setUint8(1, 76), u.setUint8(2, 86), u.setUint8(3, 1), u.setUint8(4, (t ? 4 : 0) | (i ? 1 : 0)), u.setUint32(5, o.byteLength), e <= 0 ? (a = new Uint8Array(o.byteLength + 4), a.set(o), a.set([0, 0, 0, 0], o.byteLength), a) : (r = new n(n.METADATA_TAG), r.pts = r.dts = 0, r.writeMetaDataDouble("duration", e), s = r.finalize().length, a = new Uint8Array(o.byteLength + s), a.set(o), a.set(u.byteLength, s), a)
            };
        t.exports = r
    }, {}],
    45: [function(e, t, i) {
        "use strict";
        var n;
        n = function(e, t) {
            var i, r = 0,
                a = 16384,
                s = function(e, t) {
                    var i, n = e.position + t;
                    n < e.bytes.byteLength || (i = new Uint8Array(2 * n), i.set(e.bytes.subarray(0, e.position), 0), e.bytes = i, e.view = new DataView(e.bytes.buffer))
                }, o = n.widthBytes || new Uint8Array("width".length),
                u = n.heightBytes || new Uint8Array("height".length),
                d = n.videocodecidBytes || new Uint8Array("videocodecid".length);
            if (!n.widthBytes) {
                for (i = 0; i < "width".length; i++) o[i] = "width".charCodeAt(i);
                for (i = 0; i < "height".length; i++) u[i] = "height".charCodeAt(i);
                for (i = 0; i < "videocodecid".length; i++) d[i] = "videocodecid".charCodeAt(i);
                n.widthBytes = o, n.heightBytes = u, n.videocodecidBytes = d
            }
            switch (this.keyFrame = !1, e) {
                case n.VIDEO_TAG:
                    this.length = 16, a *= 6;
                    break;
                case n.AUDIO_TAG:
                    this.length = 13, this.keyFrame = !0;
                    break;
                case n.METADATA_TAG:
                    this.length = 29, this.keyFrame = !0;
                    break;
                default:
                    throw new Error("Unknown FLV tag type")
            }
            this.bytes = new Uint8Array(a), this.view = new DataView(this.bytes.buffer), this.bytes[0] = e, this.position = this.length, this.keyFrame = t, this.pts = 0, this.dts = 0, this.writeBytes = function(e, t, i) {
                var n, r = t || 0;
                i = i || e.byteLength, n = r + i, s(this, i), this.bytes.set(e.subarray(r, n), this.position), this.position += i, this.length = Math.max(this.length, this.position)
            }, this.writeByte = function(e) {
                s(this, 1), this.bytes[this.position] = e, this.position++, this.length = Math.max(this.length, this.position)
            }, this.writeShort = function(e) {
                s(this, 2), this.view.setUint16(this.position, e), this.position += 2, this.length = Math.max(this.length, this.position)
            }, this.negIndex = function(e) {
                return this.bytes[this.length - e]
            }, this.nalUnitSize = function() {
                return 0 === r ? 0 : this.length - (r + 4)
            }, this.startNalUnit = function() {
                if (r > 0) throw new Error("Attempted to create new NAL wihout closing the old one");
                r = this.length, this.length += 4, this.position = this.length
            }, this.endNalUnit = function(e) {
                var t, i;
                this.length === r + 4 ? this.length -= 4 : r > 0 && (t = r + 4, i = this.length - t, this.position = r, this.view.setUint32(this.position, i), this.position = this.length, e && e.push(this.bytes.subarray(t, t + i))), r = 0
            }, this.writeMetaDataDouble = function(e, t) {
                var i;
                if (s(this, 2 + e.length + 9), this.view.setUint16(this.position, e.length), this.position += 2, "width" === e) this.bytes.set(o, this.position), this.position += 5;
                else if ("height" === e) this.bytes.set(u, this.position), this.position += 6;
                else if ("videocodecid" === e) this.bytes.set(d, this.position), this.position += 12;
                else for (i = 0; i < e.length; i++) this.bytes[this.position] = e.charCodeAt(i), this.position++;
                this.position++, this.view.setFloat64(this.position, t), this.position += 8, this.length = Math.max(this.length, this.position), ++r
            }, this.writeMetaDataBoolean = function(e, t) {
                var i;
                for (s(this, 2), this.view.setUint16(this.position, e.length), this.position += 2, i = 0; i < e.length; i++) s(this, 1), this.bytes[this.position] = e.charCodeAt(i), this.position++;
                s(this, 2), this.view.setUint8(this.position, 1), this.position++, this.view.setUint8(this.position, t ? 1 : 0), this.position++, this.length = Math.max(this.length, this.position), ++r
            }, this.finalize = function() {
                var e, i;
                switch (this.bytes[0]) {
                    case n.VIDEO_TAG:
                        this.bytes[11] = 7 | (this.keyFrame || t ? 16 : 32), this.bytes[12] = t ? 0 : 1, e = this.pts - this.dts, this.bytes[13] = (16711680 & e) >>> 16, this.bytes[14] = (65280 & e) >>> 8, this.bytes[15] = (255 & e) >>> 0;
                        break;
                    case n.AUDIO_TAG:
                        this.bytes[11] = 175, this.bytes[12] = t ? 0 : 1;
                        break;
                    case n.METADATA_TAG:
                        this.position = 11, this.view.setUint8(this.position, 2), this.position++, this.view.setUint16(this.position, 10), this.position += 2, this.bytes.set([111, 110, 77, 101, 116, 97, 68, 97, 116, 97], this.position), this.position += 10, this.bytes[this.position] = 8, this.position++, this.view.setUint32(this.position, r), this.position = this.length, this.bytes.set([0, 0, 9], this.position), this.position += 3, this.length = this.position
                }
                return i = this.length - 11, this.bytes[1] = (16711680 & i) >>> 16, this.bytes[2] = (65280 & i) >>> 8, this.bytes[3] = (255 & i) >>> 0, this.bytes[4] = (16711680 & this.dts) >>> 16, this.bytes[5] = (65280 & this.dts) >>> 8, this.bytes[6] = (255 & this.dts) >>> 0, this.bytes[7] = (4278190080 & this.dts) >>> 24, this.bytes[8] = 0, this.bytes[9] = 0, this.bytes[10] = 0, s(this, 4), this.view.setUint32(this.length, this.length), this.length += 4, this.position += 4, this.bytes = this.bytes.subarray(0, this.length), this.frameTime = n.frameTime(this.bytes), this
            }
        }, n.AUDIO_TAG = 8, n.VIDEO_TAG = 9, n.METADATA_TAG = 18, n.isAudioFrame = function(e) {
            return n.AUDIO_TAG === e[0]
        }, n.isVideoFrame = function(e) {
            return n.VIDEO_TAG === e[0]
        }, n.isMetaData = function(e) {
            return n.METADATA_TAG === e[0]
        }, n.isKeyFrame = function(e) {
            return n.isVideoFrame(e) ? 23 === e[11] : !! n.isAudioFrame(e) || !! n.isMetaData(e)
        }, n.frameTime = function(e) {
            var t = e[4] << 16;
            return t |= e[5] << 8, t |= e[6] << 0, t |= e[7] << 24
        }, t.exports = n
    }, {}],
    46: [function(e, t, i) {
        t.exports = {
            tag: e(45),
            Transmuxer: e(48),
            getFlvHeader: e(44)
        }
    }, {}],
    47: [function(e, t, i) {
        "use strict";
        var n = function() {
            var e = this;
            this.list = [], this.push = function(e) {
                this.list.push({
                    bytes: e.bytes,
                    dts: e.dts,
                    pts: e.pts,
                    keyFrame: e.keyFrame,
                    metaDataTag: e.metaDataTag
                })
            }, Object.defineProperty(this, "length", {
                get: function() {
                    return e.list.length
                }
            })
        };
        t.exports = n
    }, {}],
    48: [function(e, t, i) {
        "use strict";
        var n, r, a, s, o, u, d = e(62),
            l = e(45),
            f = e(50),
            c = e(40),
            h = e(41).H264Stream,
            p = e(43),
            m = e(47);
        s = function(e, t) {
            "number" == typeof t.pts && (e.timelineStartInfo.pts === undefined ? e.timelineStartInfo.pts = t.pts : e.timelineStartInfo.pts = Math.min(e.timelineStartInfo.pts, t.pts)), "number" == typeof t.dts && (e.timelineStartInfo.dts === undefined ? e.timelineStartInfo.dts = t.dts : e.timelineStartInfo.dts = Math.min(e.timelineStartInfo.dts, t.dts))
        }, o = function(e, t) {
            var i = new l(l.METADATA_TAG);
            return i.dts = t, i.pts = t, i.writeMetaDataDouble("videocodecid", 7), i.writeMetaDataDouble("width", e.width), i.writeMetaDataDouble("height", e.height), i
        }, u = function(e, t) {
            var i, n = new l(l.VIDEO_TAG, !0);
            for (n.dts = t, n.pts = t, n.writeByte(1), n.writeByte(e.profileIdc), n.writeByte(e.profileCompatibility), n.writeByte(e.levelIdc), n.writeByte(255), n.writeByte(225), n.writeShort(e.sps[0].length), n.writeBytes(e.sps[0]), n.writeByte(e.pps.length), i = 0; i < e.pps.length; ++i) n.writeShort(e.pps[i].length), n.writeBytes(e.pps[i]);
            return n
        }, a = function(e) {
            var t, i = [],
                n = [];
            a.prototype.init.call(this), this.push = function(t) {
                s(e, t), e && (e.audioobjecttype = t.audioobjecttype, e.channelcount = t.channelcount, e.samplerate = t.samplerate, e.samplingfrequencyindex = t.samplingfrequencyindex, e.samplesize = t.samplesize, e.extraData = e.audioobjecttype << 11 | e.samplingfrequencyindex << 7 | e.channelcount << 3), t.pts = Math.round(t.pts / 90), t.dts = Math.round(t.dts / 90), i.push(t)
            }, this.flush = function() {
                var r, a, s, o = new m;
                if (0 === i.length) return void this.trigger("done", "AudioSegmentStream");
                for (s = -Infinity; i.length;) r = i.shift(), n.length && r.pts >= n[0] && (s = n.shift(), this.writeMetaDataTags(o, s)), (e.extraData !== t || r.pts - s >= 1e3) && (this.writeMetaDataTags(o, r.pts), t = e.extraData, s = r.pts), a = new l(l.AUDIO_TAG), a.pts = r.pts, a.dts = r.dts, a.writeBytes(r.data), o.push(a.finalize());
                n.length = 0, t = null, this.trigger("data", {
                    track: e,
                    tags: o.list
                }), this.trigger("done", "AudioSegmentStream")
            }, this.writeMetaDataTags = function(t, i) {
                var n;
                n = new l(l.METADATA_TAG), n.pts = i, n.dts = i, n.writeMetaDataDouble("audiocodecid", 10), n.writeMetaDataBoolean("stereo", 2 === e.channelcount), n.writeMetaDataDouble("audiosamplerate", e.samplerate), n.writeMetaDataDouble("audiosamplesize", 16), t.push(n.finalize()), n = new l(l.AUDIO_TAG, !0), n.pts = i, n.dts = i, n.view.setUint16(n.position, e.extraData), n.position += 2, n.length = Math.max(n.length, n.position), t.push(n.finalize())
            }, this.onVideoKeyFrame = function(e) {
                n.push(e)
            }
        }, a.prototype = new d, r = function(e) {
            var t, i, n = [];
            r.prototype.init.call(this), this.finishFrame = function(n, r) {
                if (r) {
                    if (t && e && e.newMetadata && (r.keyFrame || 0 === n.length)) {
                        var a = o(t, r.dts).finalize(),
                            s = u(e, r.dts).finalize();
                        a.metaDataTag = s.metaDataTag = !0, n.push(a), n.push(s), e.newMetadata = !1, this.trigger("keyframe", r.dts)
                    }
                    r.endNalUnit(), n.push(r.finalize()), i = null
                }
            }, this.push = function(t) {
                s(e, t), t.pts = Math.round(t.pts / 90), t.dts = Math.round(t.dts / 90), n.push(t)
            }, this.flush = function() {
                for (var r, a = new m; n.length && "access_unit_delimiter_rbsp" !== n[0].nalUnitType;) n.shift();
                if (0 === n.length) return void this.trigger("done", "VideoSegmentStream");
                for (; n.length;) r = n.shift(), "seq_parameter_set_rbsp" === r.nalUnitType ? (e.newMetadata = !0, t = r.config, e.width = t.width, e.height = t.height, e.sps = [r.data], e.profileIdc = t.profileIdc, e.levelIdc = t.levelIdc, e.profileCompatibility = t.profileCompatibility, i.endNalUnit()) : "pic_parameter_set_rbsp" === r.nalUnitType ? (e.newMetadata = !0, e.pps = [r.data], i.endNalUnit()) : "access_unit_delimiter_rbsp" === r.nalUnitType ? (i && this.finishFrame(a, i), i = new l(l.VIDEO_TAG), i.pts = r.pts, i.dts = r.dts) : ("slice_layer_without_partitioning_rbsp_idr" === r.nalUnitType && (i.keyFrame = !0), i.endNalUnit()), i.startNalUnit(), i.writeBytes(r.data);
                i && this.finishFrame(a, i), this.trigger("data", {
                    track: e,
                    tags: a.list
                }), this.trigger("done", "VideoSegmentStream")
            }
        }, r.prototype = new d, n = function(e) {
            var t, i, s, o, u, d, l, m, g, y, _, v, b = this;
            n.prototype.init.call(this), e = e || {}, this.metadataStream = new f.MetadataStream, e.metadataStream = this.metadataStream, t = new f.TransportPacketStream, i = new f.TransportParseStream, s = new f.ElementaryStream, o = new f.TimestampRolloverStream("video"), u = new f.TimestampRolloverStream("audio"), d = new f.TimestampRolloverStream("timed-metadata"), l = new c, m = new h, v = new p(e), t.pipe(i).pipe(s), s.pipe(o).pipe(m), s.pipe(u).pipe(l), s.pipe(d).pipe(this.metadataStream).pipe(v), _ = new f.CaptionStream, m.pipe(_).pipe(v), s.on("data", function(e) {
                var t, i, n;
                if ("metadata" === e.type) {
                    for (t = e.tracks.length; t--;) "video" === e.tracks[t].type ? i = e.tracks[t] : "audio" === e.tracks[t].type && (n = e.tracks[t]);
                    i && !g && (v.numberOfTracks++, g = new r(i), m.pipe(g).pipe(v)), n && !y && (v.numberOfTracks++, y = new a(n), l.pipe(y).pipe(v), g && g.on("keyframe", y.onVideoKeyFrame))
                }
            }), this.push = function(e) {
                t.push(e)
            }, this.flush = function() {
                t.flush()
            }, this.resetCaptions = function() {
                _.reset()
            }, v.on("data", function(e) {
                b.trigger("data", e)
            }), v.on("done", function() {
                b.trigger("done")
            })
        }, n.prototype = new d, t.exports = n
    }, {}],
    49: [function(e, t, i) {
        "use strict";
        var n = e(62),
            r = function(e) {
                for (var t = 0, i = {
                    payloadType: -1,
                    payloadSize: 0
                }, n = 0, r = 0; t < e.byteLength && 128 !== e[t];) {
                    for (; 255 === e[t];) n += 255, t++;
                    for (n += e[t++]; 255 === e[t];) r += 255, t++;
                    if (r += e[t++], !i.payload && 4 === n) {
                        i.payloadType = n, i.payloadSize = r, i.payload = e.subarray(t, t + r);
                        break
                    }
                    t += r, n = 0, r = 0
                }
                return i
            }, a = function(e) {
                return 181 !== e.payload[0] ? null : 49 != (e.payload[1] << 8 | e.payload[2]) ? null : "GA94" !== String.fromCharCode(e.payload[3], e.payload[4], e.payload[5], e.payload[6]) ? null : 3 !== e.payload[7] ? null : e.payload.subarray(8, e.payload.length - 1)
            }, s = function(e, t) {
                var i, n, r, a, s = [];
                if (!(64 & t[0])) return s;
                for (n = 31 & t[0], i = 0; i < n; i++) r = 3 * i, a = {
                    type: 3 & t[r + 2],
                    pts: e
                }, 4 & t[r + 2] && (a.ccData = t[r + 3] << 8 | t[r + 4], s.push(a));
                return s
            }, o = function() {
                o.prototype.init.call(this), this.captionPackets_ = [], this.ccStreams_ = [new c(0, 0), new c(0, 1), new c(1, 0), new c(1, 1)], this.reset(), this.ccStreams_.forEach(function(e) {
                    e.on("data", this.trigger.bind(this, "data")), e.on("done", this.trigger.bind(this, "done"))
                }, this)
            };
        o.prototype = new n, o.prototype.push = function(e) {
            var t, i;
            if ("sei_rbsp" === e.nalUnitType && (t = r(e.escapedRBSP), 4 === t.payloadType && (i = a(t)))) {
                if (e.dts < this.latestDts_) return void(this.ignoreNextEqualDts_ = !0);
                if (e.dts === this.latestDts_ && this.ignoreNextEqualDts_) return void(this.ignoreNextEqualDts_ = !1);
                this.captionPackets_ = this.captionPackets_.concat(s(e.pts, i)), this.latestDts_ = e.dts
            }
        }, o.prototype.flush = function() {
            if (!this.captionPackets_.length) return void this.ccStreams_.forEach(function(e) {
                e.flush()
            }, this);
            this.captionPackets_.forEach(function(e, t) {
                e.presortIndex = t
            }), this.captionPackets_.sort(function(e, t) {
                return e.pts === t.pts ? e.presortIndex - t.presortIndex : e.pts - t.pts
            }), this.captionPackets_.forEach(function(e) {
                e.type < 2 && this.dispatchCea608Packet(e)
            }, this), this.captionPackets_.length = 0, this.ccStreams_.forEach(function(e) {
                e.flush()
            }, this)
        }, o.prototype.reset = function() {
            this.latestDts_ = null, this.ignoreNextEqualDts_ = !1, this.activeCea608Channel_ = [null, null], this.ccStreams_.forEach(function(e) {
                e.reset()
            })
        }, o.prototype.dispatchCea608Packet = function(e) {
            this.setsChannel1Active(e) ? this.activeCea608Channel_[e.type] = 0 : this.setsChannel2Active(e) && (this.activeCea608Channel_[e.type] = 1), null !== this.activeCea608Channel_[e.type] && this.ccStreams_[(e.type << 1) + this.activeCea608Channel_[e.type]].push(e)
        }, o.prototype.setsChannel1Active = function(e) {
            return 4096 == (30720 & e.ccData)
        }, o.prototype.setsChannel2Active = function(e) {
            return 6144 == (30720 & e.ccData)
        };
        var u = {
                42: 225,
                92: 233,
                94: 237,
                95: 243,
                96: 250,
                123: 231,
                124: 247,
                125: 209,
                126: 241,
                127: 9608,
                304: 174,
                305: 176,
                306: 189,
                307: 191,
                308: 8482,
                309: 162,
                310: 163,
                311: 9834,
                312: 224,
                313: 160,
                314: 232,
                315: 226,
                316: 234,
                317: 238,
                318: 244,
                319: 251,
                544: 193,
                545: 201,
                546: 211,
                547: 218,
                548: 220,
                549: 252,
                550: 8216,
                551: 161,
                552: 42,
                553: 39,
                554: 8212,
                555: 169,
                556: 8480,
                557: 8226,
                558: 8220,
                559: 8221,
                560: 192,
                561: 194,
                562: 199,
                563: 200,
                564: 202,
                565: 203,
                566: 235,
                567: 206,
                568: 207,
                569: 239,
                570: 212,
                571: 217,
                572: 249,
                573: 219,
                574: 171,
                575: 187,
                800: 195,
                801: 227,
                802: 205,
                803: 204,
                804: 236,
                805: 210,
                806: 242,
                807: 213,
                808: 245,
                809: 123,
                810: 125,
                811: 92,
                812: 94,
                813: 95,
                814: 124,
                815: 126,
                816: 196,
                817: 228,
                818: 214,
                819: 246,
                820: 223,
                821: 165,
                822: 164,
                823: 9474,
                824: 197,
                825: 229,
                826: 216,
                827: 248,
                828: 9484,
                829: 9488,
                830: 9492,
                831: 9496
            }, d = function(e) {
                return null === e ? "" : (e = u[e] || e, String.fromCharCode(e))
            }, l = [4352, 4384, 4608, 4640, 5376, 5408, 5632, 5664, 5888, 5920, 4096, 4864, 4896, 5120, 5152],
            f = function() {
                for (var e = [], t = 15; t--;) e.push("");
                return e
            }, c = function(e, t) {
                c.prototype.init.call(this), this.field_ = e || 0, this.dataChannel_ = t || 0, this.name_ = "CC" + (1 + (this.field_ << 1 | this.dataChannel_)), this.setConstants(), this.reset(), this.push = function(e) {
                    var t, i, n, r, a;
                    if ((t = 32639 & e.ccData) === this.lastControlCode_) return void(this.lastControlCode_ = null);
                    if (4096 == (61440 & t) ? this.lastControlCode_ = t : t !== this.PADDING_ && (this.lastControlCode_ = null), n = t >>> 8, r = 255 & t, t !== this.PADDING_) if (t === this.RESUME_CAPTION_LOADING_) this.mode_ = "popOn";
                    else if (t === this.END_OF_CAPTION_) this.clearFormatting(e.pts), this.flushDisplayed(e.pts), i = this.displayed_, this.displayed_ = this.nonDisplayed_, this.nonDisplayed_ = i, this.startPts_ = e.pts;
                    else if (t === this.ROLL_UP_2_ROWS_) this.topRow_ = 13, this.mode_ = "rollUp";
                    else if (t === this.ROLL_UP_3_ROWS_) this.topRow_ = 12, this.mode_ = "rollUp";
                    else if (t === this.ROLL_UP_4_ROWS_) this.topRow_ = 11, this.mode_ = "rollUp";
                    else if (t === this.CARRIAGE_RETURN_) this.clearFormatting(e.pts), this.flushDisplayed(e.pts), this.shiftRowsUp_(), this.startPts_ = e.pts;
                    else if (t === this.BACKSPACE_) "popOn" === this.mode_ ? this.nonDisplayed_[14] = this.nonDisplayed_[14].slice(0, - 1) : this.displayed_[14] = this.displayed_[14].slice(0, - 1);
                    else if (t === this.ERASE_DISPLAYED_MEMORY_) this.flushDisplayed(e.pts), this.displayed_ = f();
                    else if (t === this.ERASE_NON_DISPLAYED_MEMORY_) this.nonDisplayed_ = f();
                    else if (t === this.RESUME_DIRECT_CAPTIONING_) this.mode_ = "paintOn";
                    else if (this.isSpecialCharacter(n, r)) n = (3 & n) << 8, a = d(n | r), this[this.mode_](e.pts, a), this.column_++;
                    else if (this.isExtCharacter(n, r)) "popOn" === this.mode_ ? this.nonDisplayed_[this.row_] = this.nonDisplayed_[this.row_].slice(0, - 1) : this.displayed_[14] = this.displayed_[14].slice(0, - 1), n = (3 & n) << 8, a = d(n | r), this[this.mode_](e.pts, a), this.column_++;
                    else if (this.isMidRowCode(n, r)) this.clearFormatting(e.pts), this[this.mode_](e.pts, " "), this.column_++, 14 == (14 & r) && this.addFormatting(e.pts, ["i"]), 1 == (1 & r) && this.addFormatting(e.pts, ["u"]);
                    else if (this.isOffsetControlCode(n, r)) this.column_ += 3 & r;
                    else if (this.isPAC(n, r)) {
                        var s = l.indexOf(7968 & t);
                        s !== this.row_ && (this.clearFormatting(e.pts), this.row_ = s), 1 & r && -1 === this.formatting_.indexOf("u") && this.addFormatting(e.pts, ["u"]), 16 == (16 & t) && (this.column_ = 4 * ((14 & t) >> 1)), this.isColorPAC(r) && 14 == (14 & r) && this.addFormatting(e.pts, ["i"])
                    } else this.isNormalChar(n) && (0 === r && (r = null), a = d(n), a += d(r), this[this.mode_](e.pts, a), this.column_ += a.length)
                }
            };
        c.prototype = new n, c.prototype.flushDisplayed = function(e) {
            var t = this.displayed_.map(function(e) {
                return e.trim()
            }).join("\n").replace(/^\n+|\n+$/g, "");
            t.length && this.trigger("data", {
                startPts: this.startPts_,
                endPts: e,
                text: t,
                stream: this.name_
            })
        }, c.prototype.reset = function() {
            this.mode_ = "popOn", this.topRow_ = 0, this.startPts_ = 0, this.displayed_ = f(), this.nonDisplayed_ = f(), this.lastControlCode_ = null, this.column_ = 0, this.row_ = 14, this.formatting_ = []
        }, c.prototype.setConstants = function() {
            0 === this.dataChannel_ ? (this.BASE_ = 16, this.EXT_ = 17, this.CONTROL_ = (20 | this.field_) << 8, this.OFFSET_ = 23) : 1 === this.dataChannel_ && (this.BASE_ = 24, this.EXT_ = 25, this.CONTROL_ = (28 | this.field_) << 8, this.OFFSET_ = 31), this.PADDING_ = 0, this.RESUME_CAPTION_LOADING_ = 32 | this.CONTROL_, this.END_OF_CAPTION_ = 47 | this.CONTROL_, this.ROLL_UP_2_ROWS_ = 37 | this.CONTROL_, this.ROLL_UP_3_ROWS_ = 38 | this.CONTROL_, this.ROLL_UP_4_ROWS_ = 39 | this.CONTROL_, this.CARRIAGE_RETURN_ = 45 | this.CONTROL_, this.RESUME_DIRECT_CAPTIONING_ = 41 | this.CONTROL_, this.BACKSPACE_ = 33 | this.CONTROL_, this.ERASE_DISPLAYED_MEMORY_ = 44 | this.CONTROL_, this.ERASE_NON_DISPLAYED_MEMORY_ = 46 | this.CONTROL_
        }, c.prototype.isSpecialCharacter = function(e, t) {
            return e === this.EXT_ && t >= 48 && t <= 63
        }, c.prototype.isExtCharacter = function(e, t) {
            return (e === this.EXT_ + 1 || e === this.EXT_ + 2) && t >= 32 && t <= 63
        }, c.prototype.isMidRowCode = function(e, t) {
            return e === this.EXT_ && t >= 32 && t <= 47
        }, c.prototype.isOffsetControlCode = function(e, t) {
            return e === this.OFFSET_ && t >= 33 && t <= 35
        }, c.prototype.isPAC = function(e, t) {
            return e >= this.BASE_ && e < this.BASE_ + 8 && t >= 64 && t <= 127
        }, c.prototype.isColorPAC = function(e) {
            return e >= 64 && e <= 79 || e >= 96 && e <= 127
        }, c.prototype.isNormalChar = function(e) {
            return e >= 32 && e <= 127
        }, c.prototype.addFormatting = function(e, t) {
            this.formatting_ = this.formatting_.concat(t);
            var i = t.reduce(function(e, t) {
                return e + "<" + t + ">"
            }, "");
            this[this.mode_](e, i)
        }, c.prototype.clearFormatting = function(e) {
            if (this.formatting_.length) {
                var t = this.formatting_.reverse().reduce(function(e, t) {
                    return e + "</" + t + ">"
                }, "");
                this.formatting_ = [], this[this.mode_](e, t)
            }
        }, c.prototype.popOn = function(e, t) {
            var i = this.nonDisplayed_[this.row_];
            i += t, this.nonDisplayed_[this.row_] = i
        }, c.prototype.rollUp = function(e, t) {
            var i = this.displayed_[14];
            i += t, this.displayed_[14] = i
        }, c.prototype.shiftRowsUp_ = function() {
            var e;
            for (e = 0; e < this.topRow_; e++) this.displayed_[e] = "";
            for (e = this.topRow_; e < 14; e++) this.displayed_[e] = this.displayed_[e + 1];
            this.displayed_[14] = ""
        }, c.prototype.paintOn = function() {}, t.exports = {
            CaptionStream: o,
            Cea608Stream: c
        }
    }, {}],
    50: [function(e, t, i) {
        "use strict";
        var n, r, a, s = e(62),
            o = e(49),
            u = e(53),
            d = e(54).TimestampRolloverStream,
            l = e(53);
        n = function() {
            var e = new Uint8Array(188),
                t = 0;
            n.prototype.init.call(this), this.push = function(i) {
                var n, r = 0,
                    a = 188;
                for (t ? (n = new Uint8Array(i.byteLength + t), n.set(e.subarray(0, t)), n.set(i, t), t = 0) : n = i; a < n.byteLength;) 71 !== n[r] || 71 !== n[a] ? (r++, a++) : (this.trigger("data", n.subarray(r, a)), r += 188, a += 188);
                r < n.byteLength && (e.set(n.subarray(r), 0), t = n.byteLength - r)
            }, this.flush = function() {
                188 === t && 71 === e[0] && (this.trigger("data", e), t = 0), this.trigger("done")
            }
        }, n.prototype = new s, r = function() {
            var e, t, i, n;
            r.prototype.init.call(this), n = this, this.packetsWaitingForPmt = [], this.programMapTable = undefined, e = function(e, n) {
                var r = 0;
                n.payloadUnitStartIndicator && (r += e[r] + 1), "pat" === n.type ? t(e.subarray(r), n) : i(e.subarray(r), n)
            }, t = function(e, t) {
                t.section_number = e[7], t.last_section_number = e[8], n.pmtPid = (31 & e[10]) << 8 | e[11], t.pmtPid = n.pmtPid
            }, i = function(e, t) {
                var i, r, a, s;
                if (1 & e[5]) {
                    for (n.programMapTable = {
                        video: null,
                        audio: null,
                        "timed-metadata": {}
                    }, i = (15 & e[1]) << 8 | e[2], r = 3 + i - 4, a = (15 & e[10]) << 8 | e[11], s = 12 + a; s < r;) {
                        var o = e[s],
                            d = (31 & e[s + 1]) << 8 | e[s + 2];
                        o === u.H264_STREAM_TYPE && null === n.programMapTable.video ? n.programMapTable.video = d : o === u.ADTS_STREAM_TYPE && null === n.programMapTable.audio ? n.programMapTable.audio = d : o === u.METADATA_STREAM_TYPE && (n.programMapTable["timed-metadata"][d] = o), s += 5 + ((15 & e[s + 3]) << 8 | e[s + 4])
                    }
                    t.programMapTable = n.programMapTable
                }
            }, this.push = function(t) {
                var i = {}, n = 4;
                if (i.payloadUnitStartIndicator = !! (64 & t[1]), i.pid = 31 & t[1], i.pid <<= 8, i.pid |= t[2], (48 & t[3]) >>> 4 > 1 && (n += t[n] + 1), 0 === i.pid) i.type = "pat", e(t.subarray(n), i), this.trigger("data", i);
                else if (i.pid === this.pmtPid) for (i.type = "pmt", e(t.subarray(n), i), this.trigger("data", i); this.packetsWaitingForPmt.length;) this.processPes_.apply(this, this.packetsWaitingForPmt.shift());
                else this.programMapTable === undefined ? this.packetsWaitingForPmt.push([t, n, i]) : this.processPes_(t, n, i)
            }, this.processPes_ = function(e, t, i) {
                i.pid === this.programMapTable.video ? i.streamType = u.H264_STREAM_TYPE : i.pid === this.programMapTable.audio ? i.streamType = u.ADTS_STREAM_TYPE : i.streamType = this.programMapTable["timed-metadata"][i.pid], i.type = "pes", i.data = e.subarray(t), this.trigger("data", i)
            }
        }, r.prototype = new s, r.STREAM_TYPES = {
            h264: 27,
            adts: 15
        }, a = function() {
            var e = this,
                t = {
                    data: [],
                    size: 0
                }, i = {
                    data: [],
                    size: 0
                }, n = {
                    data: [],
                    size: 0
                }, r = function(e, t) {
                    var i;
                    t.packetLength = 6 + (e[4] << 8 | e[5]), t.dataAlignmentIndicator = 0 != (4 & e[6]), i = e[7], 192 & i && (t.pts = (14 & e[9]) << 27 | (255 & e[10]) << 20 | (254 & e[11]) << 12 | (255 & e[12]) << 5 | (254 & e[13]) >>> 3, t.pts *= 4, t.pts += (6 & e[13]) >>> 1, t.dts = t.pts, 64 & i && (t.dts = (14 & e[14]) << 27 | (255 & e[15]) << 20 | (254 & e[16]) << 12 | (255 & e[17]) << 5 | (254 & e[18]) >>> 3, t.dts *= 4, t.dts += (6 & e[18]) >>> 1)), t.data = e.subarray(9 + e[8])
                }, s = function(t, i, n) {
                    var a, s = new Uint8Array(t.size),
                        o = {
                            type: i
                        }, u = 0,
                        d = 0,
                        l = !1;
                    if (t.data.length && !(t.size < 9)) {
                        for (o.trackId = t.data[0].pid, u = 0; u < t.data.length; u++) a = t.data[u], s.set(a.data, d), d += a.data.byteLength;
                        r(s, o), l = "video" === i || o.packetLength <= t.size, (n || l) && (t.size = 0, t.data.length = 0), l && e.trigger("data", o)
                    }
                };
            a.prototype.init.call(this), this.push = function(r) {
                ({
                    pat: function() {},
                    pes: function() {
                        var e, a;
                        switch (r.streamType) {
                            case u.H264_STREAM_TYPE:
                            case l.H264_STREAM_TYPE:
                                e = t, a = "video";
                                break;
                            case u.ADTS_STREAM_TYPE:
                                e = i, a = "audio";
                                break;
                            case u.METADATA_STREAM_TYPE:
                                e = n, a = "timed-metadata";
                                break;
                            default:
                                return
                        }
                        r.payloadUnitStartIndicator && s(e, a, !0), e.data.push(r), e.size += r.data.byteLength
                    },
                    pmt: function() {
                        var t = {
                            type: "metadata",
                            tracks: []
                        }, i = r.programMapTable;
                        null !== i.video && t.tracks.push({
                            timelineStartInfo: {
                                baseMediaDecodeTime: 0
                            },
                            id: +i.video,
                            codec: "avc",
                            type: "video"
                        }), null !== i.audio && t.tracks.push({
                            timelineStartInfo: {
                                baseMediaDecodeTime: 0
                            },
                            id: +i.audio,
                            codec: "adts",
                            type: "audio"
                        }), e.trigger("data", t)
                    }
                })[r.type]()
            }, this.flush = function() {
                s(t, "video"), s(i, "audio"), s(n, "timed-metadata"), this.trigger("done")
            }
        }, a.prototype = new s;
        var f = {
            PAT_PID: 0,
            MP2T_PACKET_LENGTH: 188,
            TransportPacketStream: n,
            TransportParseStream: r,
            ElementaryStream: a,
            TimestampRolloverStream: d,
            CaptionStream: o.CaptionStream,
            Cea608Stream: o.Cea608Stream,
            MetadataStream: e(51)
        };
        for (var c in u) u.hasOwnProperty(c) && (f[c] = u[c]);
        t.exports = f
    }, {}],
    51: [function(e, t, i) {
        "use strict";
        var n, r = e(62),
            a = e(53),
            s = function(e, t, i) {
                var n, r = "";
                for (n = t; n < i; n++) r += "%" + ("00" + e[n].toString(16)).slice(-2);
                return r
            }, o = function(e, t, i) {
                return decodeURIComponent(s(e, t, i))
            }, u = function(e, t, i) {
                return unescape(s(e, t, i))
            }, d = function(e) {
                return e[0] << 21 | e[1] << 14 | e[2] << 7 | e[3]
            }, l = {
                TXXX: function(e) {
                    var t;
                    if (3 === e.data[0]) {
                        for (t = 1; t < e.data.length; t++) if (0 === e.data[t]) {
                            e.description = o(e.data, 1, t), e.value = o(e.data, t + 1, e.data.length).replace(/\0*$/, "");
                            break
                        }
                        e.data = e.value
                    }
                },
                WXXX: function(e) {
                    var t;
                    if (3 === e.data[0]) for (t = 1; t < e.data.length; t++) if (0 === e.data[t]) {
                        e.description = o(e.data, 1, t), e.url = o(e.data, t + 1, e.data.length);
                        break
                    }
                },
                PRIV: function(e) {
                    var t;
                    for (t = 0; t < e.data.length; t++) if (0 === e.data[t]) {
                        e.owner = u(e.data, 0, t);
                        break
                    }
                    e.privateData = e.data.subarray(t + 1), e.data = e.privateData
                }
            };
        n = function(e) {
            var t, i = {
                    debug: !(!e || !e.debug),
                    descriptor: e && e.descriptor
                }, r = 0,
                s = [],
                o = 0;
            if (n.prototype.init.call(this), this.dispatchType = a.METADATA_STREAM_TYPE.toString(16), i.descriptor) for (t = 0; t < i.descriptor.length; t++) this.dispatchType += ("00" + i.descriptor[t].toString(16)).slice(-2);
            this.push = function(e) {
                var t, n, a, u, f, c;
                if ("timed-metadata" === e.type) {
                    if (e.dataAlignmentIndicator && (o = 0, s.length = 0), 0 === s.length && (e.data.length < 10 || e.data[0] !== "I".charCodeAt(0) || e.data[1] !== "D".charCodeAt(0) || e.data[2] !== "3".charCodeAt(0))) return void(i.debug && console.log("Skipping unrecognized metadata packet"));
                    if (s.push(e), o += e.data.byteLength, 1 === s.length && (r = d(e.data.subarray(6, 10)), r += 10), !(o < r)) {
                        for (t = {
                            data: new Uint8Array(r),
                            frames: [],
                            pts: s[0].pts,
                            dts: s[0].dts
                        }, f = 0; f < r;) t.data.set(s[0].data.subarray(0, r - f), f), f += s[0].data.byteLength, o -= s[0].data.byteLength, s.shift();
                        n = 10, 64 & t.data[5] && (n += 4, n += d(t.data.subarray(10, 14)), r -= d(t.data.subarray(16, 20)));
                        do {
                            if ((a = d(t.data.subarray(n + 4, n + 8))) < 1) return console.log("Malformed ID3 frame encountered. Skipping metadata parsing.");
                            if (c = String.fromCharCode(t.data[n], t.data[n + 1], t.data[n + 2], t.data[n + 3]), u = {
                                id: c,
                                data: t.data.subarray(n + 10, n + a + 10)
                            }, u.key = u.id, l[u.id] && (l[u.id](u), "com.apple.streaming.transportStreamTimestamp" === u.owner)) {
                                var h = u.data,
                                    p = (1 & h[3]) << 30 | h[4] << 22 | h[5] << 14 | h[6] << 6 | h[7] >>> 2;
                                p *= 4, p += 3 & h[7], u.timeStamp = p, t.pts === undefined && t.dts === undefined && (t.pts = u.timeStamp, t.dts = u.timeStamp), this.trigger("timestamp", u)
                            }
                            t.frames.push(u), n += 10, n += a
                        } while (n < r);
                        this.trigger("data", t)
                    }
                }
            }
        }, n.prototype = new r, t.exports = n
    }, {}],
    52: [function(e, t, i) {
        "use strict";
        var n = e(53),
            r = function(e) {
                var t = 31 & e[1];
                return t <<= 8, t |= e[2]
            }, a = function(e) {
                return !!(64 & e[1])
            }, s = function(e) {
                var t = 0;
                return (48 & e[3]) >>> 4 > 1 && (t += e[4] + 1), t
            }, o = function(e, t) {
                var i = r(e);
                return 0 === i ? "pat" : i === t ? "pmt" : t ? "pes" : null
            }, u = function(e) {
                var t = a(e),
                    i = 4 + s(e);
                return t && (i += e[i] + 1), (31 & e[i + 10]) << 8 | e[i + 11]
            }, d = function(e) {
                var t = {}, i = a(e),
                    n = 4 + s(e);
                if (i && (n += e[n] + 1), 1 & e[n + 5]) {
                    var r, o, u;
                    r = (15 & e[n + 1]) << 8 | e[n + 2], o = 3 + r - 4, u = (15 & e[n + 10]) << 8 | e[n + 11];
                    for (var d = 12 + u; d < o;) {
                        var l = n + d;
                        t[(31 & e[l + 1]) << 8 | e[l + 2]] = e[l], d += 5 + ((15 & e[l + 3]) << 8 | e[l + 4])
                    }
                    return t
                }
            }, l = function(e, t) {
                switch (t[r(e)]) {
                    case n.H264_STREAM_TYPE:
                        return "video";
                    case n.ADTS_STREAM_TYPE:
                        return "audio";
                    case n.METADATA_STREAM_TYPE:
                        return "timed-metadata";
                    default:
                        return null
                }
            }, f = function(e) {
                if (!a(e)) return null;
                var t = 4 + s(e);
                if (t >= e.byteLength) return null;
                var i, n = null;
                return i = e[t + 7], 192 & i && (n = {}, n.pts = (14 & e[t + 9]) << 27 | (255 & e[t + 10]) << 20 | (254 & e[t + 11]) << 12 | (255 & e[t + 12]) << 5 | (254 & e[t + 13]) >>> 3, n.pts *= 4, n.pts += (6 & e[t + 13]) >>> 1, n.dts = n.pts, 64 & i && (n.dts = (14 & e[t + 14]) << 27 | (255 & e[t + 15]) << 20 | (254 & e[t + 16]) << 12 | (255 & e[t + 17]) << 5 | (254 & e[t + 18]) >>> 3, n.dts *= 4, n.dts += (6 & e[t + 18]) >>> 1)), n
            }, c = function(e) {
                switch (e) {
                    case 5:
                        return "slice_layer_without_partitioning_rbsp_idr";
                    case 6:
                        return "sei_rbsp";
                    case 7:
                        return "seq_parameter_set_rbsp";
                    case 8:
                        return "pic_parameter_set_rbsp";
                    case 9:
                        return "access_unit_delimiter_rbsp";
                    default:
                        return null
                }
            }, h = function(e) {
                for (var t, i = 4 + s(e), n = e.subarray(i), r = 0, a = 0, o = !1; a < n.byteLength - 3; a++) if (1 === n[a + 2]) {
                    r = a + 5;
                    break
                }
                for (; r < n.byteLength;) switch (n[r]) {
                    case 0:
                        if (0 !== n[r - 1]) {
                            r += 2;
                            break
                        }
                        if (0 !== n[r - 2]) {
                            r++;
                            break
                        }
                        a + 3 !== r - 2 && "slice_layer_without_partitioning_rbsp_idr" === (t = c(31 & n[a + 3])) && (o = !0);
                        do {
                            r++
                        } while (1 !== n[r] && r < n.length);
                        a = r - 2, r += 3;
                        break;
                    case 1:
                        if (0 !== n[r - 1] || 0 !== n[r - 2]) {
                            r += 3;
                            break
                        }
                        t = c(31 & n[a + 3]), "slice_layer_without_partitioning_rbsp_idr" === t && (o = !0), a = r - 2, r += 3;
                        break;
                    default:
                        r += 3
                }
                return n = n.subarray(a), r -= a, a = 0, n && n.byteLength > 3 && "slice_layer_without_partitioning_rbsp_idr" === (t = c(31 & n[a + 3])) && (o = !0), o
            };
        t.exports = {
            parseType: o,
            parsePat: u,
            parsePmt: d,
            parsePayloadUnitStartIndicator: a,
            parsePesType: l,
            parsePesTime: f,
            videoPacketContainsKeyFrame: h
        }
    }, {}],
    53: [function(e, t, i) {
        "use strict";
        t.exports = {
            H264_STREAM_TYPE: 27,
            ADTS_STREAM_TYPE: 15,
            METADATA_STREAM_TYPE: 21
        }
    }, {}],
    54: [function(e, t, i) {
        "use strict";
        var n = e(62),
            r = function(e, t) {
                var i = 1;
                for (e > t && (i = -1); Math.abs(t - e) > 4294967296;) e += 8589934592 * i;
                return e
            }, a = function(e) {
                var t, i;
                a.prototype.init.call(this), this.type_ = e, this.push = function(e) {
                    e.type === this.type_ && (i === undefined && (i = e.dts), e.dts = r(e.dts, i), e.pts = r(e.pts, i), t = e.dts, this.trigger("data", e))
                }, this.flush = function() {
                    i = t, this.trigger("done")
                }, this.discontinuity = function() {
                    i = void 0, t = void 0
                }
            };
        a.prototype = new n, t.exports = {
            TimestampRolloverStream: a,
            handleRollover: r
        }
    }, {}],
    55: [function(e, t, i) {
        t.exports = {
            generator: e(56),
            Transmuxer: e(58).Transmuxer,
            AudioSegmentStream: e(58).AudioSegmentStream,
            VideoSegmentStream: e(58).VideoSegmentStream
        }
    }, {}],
    56: [function(e, t, i) {
        "use strict";
        var n, r, a, s, o, u, d, l, f, c, h, p, m, g, y, _, v, b, T, S, w, k, O, E, A, L, P, I, C, U, D, M, R, x, B, j, N = Math.pow(2, 32) - 1;
        ! function() {
            var e;
            if (O = {
                avc1: [],
                avcC: [],
                btrt: [],
                dinf: [],
                dref: [],
                esds: [],
                ftyp: [],
                hdlr: [],
                mdat: [],
                mdhd: [],
                mdia: [],
                mfhd: [],
                minf: [],
                moof: [],
                moov: [],
                mp4a: [],
                mvex: [],
                mvhd: [],
                sdtp: [],
                smhd: [],
                stbl: [],
                stco: [],
                stsc: [],
                stsd: [],
                stsz: [],
                stts: [],
                styp: [],
                tfdt: [],
                tfhd: [],
                traf: [],
                trak: [],
                trun: [],
                trex: [],
                tkhd: [],
                vmhd: []
            }, "undefined" != typeof Uint8Array) {
                for (e in O) O.hasOwnProperty(e) && (O[e] = [e.charCodeAt(0), e.charCodeAt(1), e.charCodeAt(2), e.charCodeAt(3)]);
                E = new Uint8Array(["i".charCodeAt(0), "s".charCodeAt(0), "o".charCodeAt(0), "m".charCodeAt(0)]), L = new Uint8Array(["a".charCodeAt(0), "v".charCodeAt(0), "c".charCodeAt(0), "1".charCodeAt(0)]), A = new Uint8Array([0, 0, 0, 1]), P = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 118, 105, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 86, 105, 100, 101, 111, 72, 97, 110, 100, 108, 101, 114, 0]), I = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 115, 111, 117, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 83, 111, 117, 110, 100, 72, 97, 110, 100, 108, 101, 114, 0]), C = {
                    video: P,
                    audio: I
                }, M = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 12, 117, 114, 108, 32, 0, 0, 0, 1]), D = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]), R = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0]), x = R, B = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]), j = R, U = new Uint8Array([0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0])
            }
        }(), n = function(e) {
            var t, i, n, r = [],
                a = 0;
            for (t = 1; t < arguments.length; t++) r.push(arguments[t]);
            for (t = r.length; t--;) a += r[t].byteLength;
            for (i = new Uint8Array(a + 8), n = new DataView(i.buffer, i.byteOffset, i.byteLength), n.setUint32(0, i.byteLength), i.set(e, 4), t = 0, a = 8; t < r.length; t++) i.set(r[t], a), a += r[t].byteLength;
            return i
        }, r = function() {
            return n(O.dinf, n(O.dref, M))
        }, a = function(e) {
            return n(O.esds, new Uint8Array([0, 0, 0, 0, 3, 25, 0, 0, 0, 4, 17, 64, 21, 0, 6, 0, 0, 0, 218, 192, 0, 0, 218, 192, 5, 2, e.audioobjecttype << 3 | e.samplingfrequencyindex >>> 1, e.samplingfrequencyindex << 7 | e.channelcount << 3, 6, 1, 2]))
        }, s = function() {
            return n(O.ftyp, E, A, E, L)
        }, _ = function(e) {
            return n(O.hdlr, C[e])
        }, o = function(e) {
            return n(O.mdat, e)
        }, y = function(e) {
            var t = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 1, 95, 144, e.duration >>> 24 & 255, e.duration >>> 16 & 255, e.duration >>> 8 & 255, 255 & e.duration, 85, 196, 0, 0]);
            return e.samplerate && (t[12] = e.samplerate >>> 24 & 255, t[13] = e.samplerate >>> 16 & 255, t[14] = e.samplerate >>> 8 & 255, t[15] = 255 & e.samplerate), n(O.mdhd, t)
        }, g = function(e) {
            return n(O.mdia, y(e), _(e.type), d(e))
        }, u = function(e) {
            return n(O.mfhd, new Uint8Array([0, 0, 0, 0, (4278190080 & e) >> 24, (16711680 & e) >> 16, (65280 & e) >> 8, 255 & e]))
        }, d = function(e) {
            return n(O.minf, "video" === e.type ? n(O.vmhd, U) : n(O.smhd, D), r(), b(e))
        }, l = function(e, t) {
            for (var i = [], r = t.length; r--;) i[r] = S(t[r]);
            return n.apply(null, [O.moof, u(e)].concat(i))
        }, f = function(e) {
            for (var t = e.length, i = []; t--;) i[t] = p(e[t]);
            return n.apply(null, [O.moov, h(4294967295)].concat(i).concat(c(e)))
        }, c = function(e) {
            for (var t = e.length, i = []; t--;) i[t] = w(e[t]);
            return n.apply(null, [O.mvex].concat(i))
        }, h = function(e) {
            var t = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 1, 95, 144, (4278190080 & e) >> 24, (16711680 & e) >> 16, (65280 & e) >> 8, 255 & e, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 255, 255]);
            return n(O.mvhd, t)
        }, v = function(e) {
            var t, i, r = e.samples || [],
                a = new Uint8Array(4 + r.length);
            for (i = 0; i < r.length; i++) t = r[i].flags, a[i + 4] = t.dependsOn << 4 | t.isDependedOn << 2 | t.hasRedundancy;
            return n(O.sdtp, a)
        }, b = function(e) {
            return n(O.stbl, T(e), n(O.stts, j), n(O.stsc, x), n(O.stsz, B), n(O.stco, R))
        },
            function() {
                var e, t;
                T = function(i) {
                    return n(O.stsd, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1]), "video" === i.type ? e(i) : t(i))
                }, e = function(e) {
                    var t, i = e.sps || [],
                        r = e.pps || [],
                        a = [],
                        s = [];
                    for (t = 0; t < i.length; t++) a.push((65280 & i[t].byteLength) >>> 8), a.push(255 & i[t].byteLength), a = a.concat(Array.prototype.slice.call(i[t]));
                    for (t = 0; t < r.length; t++) s.push((65280 & r[t].byteLength) >>> 8), s.push(255 & r[t].byteLength), s = s.concat(Array.prototype.slice.call(r[t]));
                    return n(O.avc1, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (65280 & e.width) >> 8, 255 & e.width, (65280 & e.height) >> 8, 255 & e.height, 0, 72, 0, 0, 0, 72, 0, 0, 0, 0, 0, 0, 0, 1, 19, 118, 105, 100, 101, 111, 106, 115, 45, 99, 111, 110, 116, 114, 105, 98, 45, 104, 108, 115, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 24, 17, 17]), n(O.avcC, new Uint8Array([1, e.profileIdc, e.profileCompatibility, e.levelIdc, 255].concat([i.length]).concat(a).concat([r.length]).concat(s))), n(O.btrt, new Uint8Array([0, 28, 156, 128, 0, 45, 198, 192, 0, 45, 198, 192])))
                }, t = function(e) {
                    return n(O.mp4a, new Uint8Array([0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, (65280 & e.channelcount) >> 8, 255 & e.channelcount, (65280 & e.samplesize) >> 8, 255 & e.samplesize, 0, 0, 0, 0, (65280 & e.samplerate) >> 8, 255 & e.samplerate, 0, 0]), a(e))
                }
            }(), m = function(e) {
            var t = new Uint8Array([0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 0, (4278190080 & e.id) >> 24, (16711680 & e.id) >> 16, (65280 & e.id) >> 8, 255 & e.id, 0, 0, 0, 0, (4278190080 & e.duration) >> 24, (16711680 & e.duration) >> 16, (65280 & e.duration) >> 8, 255 & e.duration, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 0, 0, 0, (65280 & e.width) >> 8, 255 & e.width, 0, 0, (65280 & e.height) >> 8, 255 & e.height, 0, 0]);
            return n(O.tkhd, t)
        }, S = function(e) {
            var t, i, r, a, s, o, u;
            return t = n(O.tfhd, new Uint8Array([0, 0, 0, 58, (4278190080 & e.id) >> 24, (16711680 & e.id) >> 16, (65280 & e.id) >> 8, 255 & e.id, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])), o = Math.floor(e.baseMediaDecodeTime / (N + 1)), u = Math.floor(e.baseMediaDecodeTime % (N + 1)), i = n(O.tfdt, new Uint8Array([1, 0, 0, 0, o >>> 24 & 255, o >>> 16 & 255, o >>> 8 & 255, 255 & o, u >>> 24 & 255, u >>> 16 & 255, u >>> 8 & 255, 255 & u])), s = 92, "audio" === e.type ? (r = k(e, s), n(O.traf, t, i, r)) : (a = v(e), r = k(e, a.length + s), n(O.traf, t, i, r, a))
        }, p = function(e) {
            return e.duration = e.duration || 4294967295, n(O.trak, m(e), g(e))
        }, w = function(e) {
            var t = new Uint8Array([0, 0, 0, 0, (4278190080 & e.id) >> 24, (16711680 & e.id) >> 16, (65280 & e.id) >> 8, 255 & e.id, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1]);
            return "video" !== e.type && (t[t.length - 1] = 0), n(O.trex, t)
        },
            function() {
                var e, t, i;
                i = function(e, t) {
                    var i = 0,
                        n = 0,
                        r = 0,
                        a = 0;
                    return e.length && (e[0].duration !== undefined && (i = 1), e[0].size !== undefined && (n = 2), e[0].flags !== undefined && (r = 4), e[0].compositionTimeOffset !== undefined && (a = 8)), [0, 0, i | n | r | a, 1, (4278190080 & e.length) >>> 24, (16711680 & e.length) >>> 16, (65280 & e.length) >>> 8, 255 & e.length, (4278190080 & t) >>> 24, (16711680 & t) >>> 16, (65280 & t) >>> 8, 255 & t]
                }, t = function(e, t) {
                    var r, a, s, o;
                    for (a = e.samples || [], t += 20 + 16 * a.length, r = i(a, t), o = 0; o < a.length; o++) s = a[o], r = r.concat([(4278190080 & s.duration) >>> 24, (16711680 & s.duration) >>> 16, (65280 & s.duration) >>> 8, 255 & s.duration, (4278190080 & s.size) >>> 24, (16711680 & s.size) >>> 16, (65280 & s.size) >>> 8, 255 & s.size, s.flags.isLeading << 2 | s.flags.dependsOn, s.flags.isDependedOn << 6 | s.flags.hasRedundancy << 4 | s.flags.paddingValue << 1 | s.flags.isNonSyncSample, 61440 & s.flags.degradationPriority, 15 & s.flags.degradationPriority, (4278190080 & s.compositionTimeOffset) >>> 24, (16711680 & s.compositionTimeOffset) >>> 16, (65280 & s.compositionTimeOffset) >>> 8, 255 & s.compositionTimeOffset]);
                    return n(O.trun, new Uint8Array(r))
                }, e = function(e, t) {
                    var r, a, s, o;
                    for (a = e.samples || [], t += 20 + 8 * a.length, r = i(a, t), o = 0; o < a.length; o++) s = a[o], r = r.concat([(4278190080 & s.duration) >>> 24, (16711680 & s.duration) >>> 16, (65280 & s.duration) >>> 8, 255 & s.duration, (4278190080 & s.size) >>> 24, (16711680 & s.size) >>> 16, (65280 & s.size) >>> 8, 255 & s.size]);
                    return n(O.trun, new Uint8Array(r))
                }, k = function(i, n) {
                    return "audio" === i.type ? e(i, n) : t(i, n)
                }
            }(), t.exports = {
            ftyp: s,
            mdat: o,
            moof: l,
            moov: f,
            initSegment: function(e) {
                var t, i = s(),
                    n = f(e);
                return t = new Uint8Array(i.byteLength + n.byteLength), t.set(i), t.set(n, i.byteLength), t
            }
        }
    }, {}],
    57: [function(e, t, i) {
        "use strict";
        var n, r, a, s;
        n = function(e, t) {
            var i, a, s, o, u, d = [];
            if (!t.length) return null;
            for (i = 0; i < e.byteLength;) a = e[i] << 24, a |= e[i + 1] << 16, a |= e[i + 2] << 8, a |= e[i + 3], s = r(e.subarray(i + 4, i + 8)),
                o = a > 1 ? i + a : e.byteLength, s === t[0] && (1 === t.length ? d.push(e.subarray(i + 8, o)) : (u = n(e.subarray(i + 8, o), t.slice(1)), u.length && (d = d.concat(u)))), i = o;
            return d
        }, r = function(e) {
            var t = "";
            return t += String.fromCharCode(e[0]), t += String.fromCharCode(e[1]), t += String.fromCharCode(e[2]), t += String.fromCharCode(e[3])
        }, a = function(e) {
            var t = {};
            return n(e, ["moov", "trak"]).reduce(function(e, t) {
                var i, r, a, s, o;
                return (i = n(t, ["tkhd"])[0]) ? (r = i[0], a = 0 === r ? 12 : 20, s = i[a] << 24 | i[a + 1] << 16 | i[a + 2] << 8 | i[a + 3], (o = n(t, ["mdia", "mdhd"])[0]) ? (r = o[0], a = 0 === r ? 12 : 20, e[s] = o[a] << 24 | o[a + 1] << 16 | o[a + 2] << 8 | o[a + 3], e) : null) : null
            }, t)
        }, s = function(e, t) {
            var i, r, a;
            return i = n(t, ["moof", "traf"]), r = [].concat.apply([], i.map(function(t) {
                return n(t, ["tfhd"]).map(function(i) {
                    var r, a, s;
                    return r = i[4] << 24 | i[5] << 16 | i[6] << 8 | i[7], a = e[r] || 9e4, s = n(t, ["tfdt"]).map(function(e) {
                        var t, i;
                        return t = e[0], i = e[4] << 24 | e[5] << 16 | e[6] << 8 | e[7], 1 === t && (i *= Math.pow(2, 32), i += e[8] << 24 | e[9] << 16 | e[10] << 8 | e[11]), i
                    })[0], (s = s || Infinity) / a
                })
            })), a = Math.min.apply(null, r), isFinite(a) ? a : 0
        }, t.exports = {
            parseType: r,
            timescale: a,
            startTime: s
        }
    }, {}],
    58: [function(e, t, i) {
        "use strict";
        var n, r, a, s, o, u, d, l, f, c, h, p = e(62),
            m = e(56),
            g = e(50),
            y = e(40),
            _ = e(41).H264Stream,
            v = e(38),
            b = e(42),
            T = e(60),
            S = ["audioobjecttype", "channelcount", "samplerate", "samplingfrequencyindex", "samplesize"],
            w = ["width", "height", "profileIdc", "levelIdc", "profileCompatibility"];
        o = function() {
            return {
                size: 0,
                flags: {
                    isLeading: 0,
                    dependsOn: 1,
                    isDependedOn: 0,
                    hasRedundancy: 0,
                    degradationPriority: 0
                }
            }
        }, u = function(e) {
            return e[0] === "I".charCodeAt(0) && e[1] === "D".charCodeAt(0) && e[2] === "3".charCodeAt(0)
        }, c = function(e, t) {
            var i;
            if (e.length !== t.length) return !1;
            for (i = 0; i < e.length; i++) if (e[i] !== t[i]) return !1;
            return !0
        }, h = function(e) {
            var t, i, n = 0;
            for (t = 0; t < e.length; t++) i = e[t], n += i.data.byteLength;
            return n
        }, r = function(e) {
            var t = [],
                i = 0,
                n = 0,
                a = 0,
                s = Infinity;
            r.prototype.init.call(this), this.push = function(i) {
                d(e, i), e && S.forEach(function(t) {
                    e[t] = i[t]
                }), t.push(i)
            }, this.setEarliestDts = function(t) {
                n = t - e.timelineStartInfo.baseMediaDecodeTime
            }, this.setVideoBaseMediaDecodeTime = function(e) {
                s = e
            }, this.setAudioAppendStart = function(e) {
                a = e
            }, this.flush = function() {
                var n, r, a, s;
                if (0 === t.length) return void this.trigger("done", "AudioSegmentStream");
                n = this.trimAdtsFramesByEarliestDts_(t), e.baseMediaDecodeTime = f(e), this.prefixWithSilence_(e, n), e.samples = this.generateSampleTable_(n), a = m.mdat(this.concatenateFrameData_(n)), t = [], r = m.moof(i, [e]), s = new Uint8Array(r.byteLength + a.byteLength), i++, s.set(r), s.set(a, r.byteLength), l(e), this.trigger("data", {
                    track: e,
                    boxes: s
                }), this.trigger("done", "AudioSegmentStream")
            }, this.prefixWithSilence_ = function(e, t) {
                var i, n, r, o = 0,
                    u = 0,
                    d = 0,
                    l = 0;
                if (t.length && (i = T.audioTsToVideoTs(e.baseMediaDecodeTime, e.samplerate), o = Math.ceil(9e4 / (e.samplerate / 1024)), a && s && (u = i - Math.max(a, s), d = Math.floor(u / o), l = d * o), !(d < 1 || l > 45e3))) {
                    for (n = b[e.samplerate], n || (n = t[0].data), r = 0; r < d; r++) t.splice(r, 0, {
                        data: n
                    });
                    e.baseMediaDecodeTime -= Math.floor(T.videoTsToAudioTs(l, e.samplerate))
                }
            }, this.trimAdtsFramesByEarliestDts_ = function(t) {
                return e.minSegmentDts >= n ? t : (e.minSegmentDts = Infinity, t.filter(function(t) {
                    return t.dts >= n && (e.minSegmentDts = Math.min(e.minSegmentDts, t.dts), e.minSegmentPts = e.minSegmentDts, !0)
                }))
            }, this.generateSampleTable_ = function(e) {
                var t, i, n = [];
                for (t = 0; t < e.length; t++) i = e[t], n.push({
                    size: i.data.byteLength,
                    duration: 1024
                });
                return n
            }, this.concatenateFrameData_ = function(e) {
                var t, i, n = 0,
                    r = new Uint8Array(h(e));
                for (t = 0; t < e.length; t++) i = e[t], r.set(i.data, n), n += i.data.byteLength;
                return r
            }
        }, r.prototype = new p, n = function(e, t) {
            var i, r, a = 0,
                s = [],
                u = [];
            t = t || {}, n.prototype.init.call(this), delete e.minPTS, this.gopCache_ = [], this.push = function(t) {
                d(e, t), "seq_parameter_set_rbsp" !== t.nalUnitType || i || (i = t.config, e.sps = [t.data], w.forEach(function(t) {
                    e[t] = i[t]
                }, this)), "pic_parameter_set_rbsp" !== t.nalUnitType || r || (r = t.data, e.pps = [t.data]), s.push(t)
            }, this.flush = function() {
                for (var i, n, r, o, c, h; s.length && "access_unit_delimiter_rbsp" !== s[0].nalUnitType;) s.shift();
                if (0 === s.length) return this.resetStream_(), void this.trigger("done", "VideoSegmentStream");
                if (i = this.groupNalsIntoFrames_(s), r = this.groupFramesIntoGops_(i), r[0][0].keyFrame || (n = this.getGopForFusion_(s[0], e), n ? (r.unshift(n), r.byteLength += n.byteLength, r.nalCount += n.nalCount, r.pts = n.pts, r.dts = n.dts, r.duration += n.duration) : r = this.extendFirstKeyFrame_(r)), u.length) {
                    var p;
                    if (!(p = t.alignGopsAtEnd ? this.alignGopsAtEnd_(r) : this.alignGopsAtStart_(r))) return this.gopCache_.unshift({
                        gop: r.pop(),
                        pps: e.pps,
                        sps: e.sps
                    }), this.gopCache_.length = Math.min(6, this.gopCache_.length), s = [], this.resetStream_(), void this.trigger("done", "VideoSegmentStream");
                    l(e), r = p
                }
                d(e, r), e.samples = this.generateSampleTable_(r), c = m.mdat(this.concatenateNalData_(r)), e.baseMediaDecodeTime = f(e), this.trigger("processedGopsInfo", r.map(function(e) {
                    return {
                        pts: e.pts,
                        dts: e.dts,
                        byteLength: e.byteLength
                    }
                })), this.gopCache_.unshift({
                    gop: r.pop(),
                    pps: e.pps,
                    sps: e.sps
                }), this.gopCache_.length = Math.min(6, this.gopCache_.length), s = [], this.trigger("baseMediaDecodeTime", e.baseMediaDecodeTime), this.trigger("timelineStartInfo", e.timelineStartInfo), o = m.moof(a, [e]), h = new Uint8Array(o.byteLength + c.byteLength), a++, h.set(o), h.set(c, o.byteLength), this.trigger("data", {
                    track: e,
                    boxes: h
                }), this.resetStream_(), this.trigger("done", "VideoSegmentStream")
            }, this.resetStream_ = function() {
                l(e), i = undefined, r = undefined
            }, this.getGopForFusion_ = function(t) {
                var i, n, r, a, s, o = Infinity;
                for (s = 0; s < this.gopCache_.length; s++) a = this.gopCache_[s], r = a.gop, e.pps && c(e.pps[0], a.pps[0]) && e.sps && c(e.sps[0], a.sps[0]) && (r.dts < e.timelineStartInfo.dts || (i = t.dts - r.dts - r.duration) >= -1e4 && i <= 45e3 && (!n || o > i) && (n = a, o = i));
                return n ? n.gop : null
            }, this.extendFirstKeyFrame_ = function(e) {
                var t;
                return !e[0][0].keyFrame && e.length > 1 && (t = e.shift(), e.byteLength -= t.byteLength, e.nalCount -= t.nalCount, e[0][0].dts = t.dts, e[0][0].pts = t.pts, e[0][0].duration += t.duration), e
            }, this.groupNalsIntoFrames_ = function(e) {
                var t, i, n = [],
                    r = [];
                for (n.byteLength = 0, t = 0; t < e.length; t++) i = e[t], "access_unit_delimiter_rbsp" === i.nalUnitType ? (n.length && (n.duration = i.dts - n.dts, r.push(n)), n = [i], n.byteLength = i.data.byteLength, n.pts = i.pts, n.dts = i.dts) : ("slice_layer_without_partitioning_rbsp_idr" === i.nalUnitType && (n.keyFrame = !0), n.duration = i.dts - n.dts, n.byteLength += i.data.byteLength, n.push(i));
                return r.length && (!n.duration || n.duration <= 0) && (n.duration = r[r.length - 1].duration), r.push(n), r
            }, this.groupFramesIntoGops_ = function(e) {
                var t, i, n = [],
                    r = [];
                for (n.byteLength = 0, n.nalCount = 0, n.duration = 0, n.pts = e[0].pts, n.dts = e[0].dts, r.byteLength = 0, r.nalCount = 0, r.duration = 0, r.pts = e[0].pts, r.dts = e[0].dts, t = 0; t < e.length; t++) i = e[t], i.keyFrame ? (n.length && (r.push(n), r.byteLength += n.byteLength, r.nalCount += n.nalCount, r.duration += n.duration), n = [i], n.nalCount = i.length, n.byteLength = i.byteLength, n.pts = i.pts, n.dts = i.dts, n.duration = i.duration) : (n.duration += i.duration, n.nalCount += i.length, n.byteLength += i.byteLength, n.push(i));
                return r.length && n.duration <= 0 && (n.duration = r[r.length - 1].duration), r.byteLength += n.byteLength, r.nalCount += n.nalCount, r.duration += n.duration, r.push(n), r
            }, this.generateSampleTable_ = function(e, t) {
                var i, n, r, a, s, u = t || 0,
                    d = [];
                for (i = 0; i < e.length; i++) for (a = e[i], n = 0; n < a.length; n++) s = a[n], r = o(), r.dataOffset = u, r.compositionTimeOffset = s.pts - s.dts, r.duration = s.duration, r.size = 4 * s.length, r.size += s.byteLength, s.keyFrame && (r.flags.dependsOn = 2), u += r.size, d.push(r);
                return d
            }, this.concatenateNalData_ = function(e) {
                var t, i, n, r, a, s, o = 0,
                    u = e.byteLength,
                    d = e.nalCount,
                    l = u + 4 * d,
                    f = new Uint8Array(l),
                    c = new DataView(f.buffer);
                for (t = 0; t < e.length; t++) for (r = e[t], i = 0; i < r.length; i++) for (a = r[i], n = 0; n < a.length; n++) s = a[n], c.setUint32(o, s.data.byteLength), o += 4, f.set(s.data, o), o += s.data.byteLength;
                return f
            }, this.alignGopsAtStart_ = function(e) {
                var t, i, n, r, a, s, o, d;
                for (a = e.byteLength, s = e.nalCount, o = e.duration, t = i = 0; t < u.length && i < e.length && (n = u[t], r = e[i], n.pts !== r.pts);) r.pts > n.pts ? t++ : (i++, a -= r.byteLength, s -= r.nalCount, o -= r.duration);
                return 0 === i ? e : i === e.length ? null : (d = e.slice(i), d.byteLength = a, d.duration = o, d.nalCount = s, d.pts = d[0].pts, d.dts = d[0].dts, d)
            }, this.alignGopsAtEnd_ = function(e) {
                var t, i, n, r, a, s;
                for (t = u.length - 1, i = e.length - 1, a = null, s = !1; t >= 0 && i >= 0;) {
                    if (n = u[t], r = e[i], n.pts === r.pts) {
                        s = !0;
                        break
                    }
                    n.pts > r.pts ? t-- : (t === u.length - 1 && (a = i), i--)
                }
                if (!s && null === a) return null;
                var o;
                if (0 === (o = s ? i : a)) return e;
                var d = e.slice(o),
                    l = d.reduce(function(e, t) {
                        return e.byteLength += t.byteLength, e.duration += t.duration, e.nalCount += t.nalCount, e
                    }, {
                        byteLength: 0,
                        duration: 0,
                        nalCount: 0
                    });
                return d.byteLength = l.byteLength, d.duration = l.duration, d.nalCount = l.nalCount, d.pts = d[0].pts, d.dts = d[0].dts, d
            }, this.alignGopsWith = function(e) {
                u = e
            }
        }, n.prototype = new p, d = function(e, t) {
            "number" == typeof t.pts && (e.timelineStartInfo.pts === undefined && (e.timelineStartInfo.pts = t.pts), e.minSegmentPts === undefined ? e.minSegmentPts = t.pts : e.minSegmentPts = Math.min(e.minSegmentPts, t.pts), e.maxSegmentPts === undefined ? e.maxSegmentPts = t.pts : e.maxSegmentPts = Math.max(e.maxSegmentPts, t.pts)), "number" == typeof t.dts && (e.timelineStartInfo.dts === undefined && (e.timelineStartInfo.dts = t.dts), e.minSegmentDts === undefined ? e.minSegmentDts = t.dts : e.minSegmentDts = Math.min(e.minSegmentDts, t.dts), e.maxSegmentDts === undefined ? e.maxSegmentDts = t.dts : e.maxSegmentDts = Math.max(e.maxSegmentDts, t.dts))
        }, l = function(e) {
            delete e.minSegmentDts, delete e.maxSegmentDts, delete e.minSegmentPts, delete e.maxSegmentPts
        }, f = function(e) {
            var t, i, n = e.minSegmentDts - e.timelineStartInfo.dts;
            return t = e.timelineStartInfo.baseMediaDecodeTime, t += n, t = Math.max(0, t), "audio" === e.type && (i = e.samplerate / 9e4, t *= i, t = Math.floor(t)), t
        }, s = function(e, t) {
            this.numberOfTracks = 0, this.metadataStream = t, "undefined" != typeof e.remux ? this.remuxTracks = !! e.remux : this.remuxTracks = !0, this.pendingTracks = [], this.videoTrack = null, this.pendingBoxes = [], this.pendingCaptions = [], this.pendingMetadata = [], this.pendingBytes = 0, this.emittedTracks = 0, s.prototype.init.call(this), this.push = function(e) {
                return e.text ? this.pendingCaptions.push(e) : e.frames ? this.pendingMetadata.push(e) : (this.pendingTracks.push(e.track), this.pendingBoxes.push(e.boxes), this.pendingBytes += e.boxes.byteLength, "video" === e.track.type && (this.videoTrack = e.track), void("audio" === e.track.type && (this.audioTrack = e.track)))
            }
        }, s.prototype = new p, s.prototype.flush = function(e) {
            var t, i, n, r, a = 0,
                s = {
                    captions: [],
                    captionStreams: {},
                    metadata: [],
                    info: {}
                }, o = 0;
            if (this.pendingTracks.length < this.numberOfTracks) {
                if ("VideoSegmentStream" !== e && "AudioSegmentStream" !== e) return;
                if (this.remuxTracks) return;
                if (0 === this.pendingTracks.length) return void(++this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), this.emittedTracks = 0))
            }
            for (this.videoTrack ? (o = this.videoTrack.timelineStartInfo.pts, w.forEach(function(e) {
                s.info[e] = this.videoTrack[e]
            }, this)) : this.audioTrack && (o = this.audioTrack.timelineStartInfo.pts, S.forEach(function(e) {
                s.info[e] = this.audioTrack[e]
            }, this)), 1 === this.pendingTracks.length ? s.type = this.pendingTracks[0].type : s.type = "combined", this.emittedTracks += this.pendingTracks.length, n = m.initSegment(this.pendingTracks), s.initSegment = new Uint8Array(n.byteLength), s.initSegment.set(n), s.data = new Uint8Array(this.pendingBytes), r = 0; r < this.pendingBoxes.length; r++) s.data.set(this.pendingBoxes[r], a), a += this.pendingBoxes[r].byteLength;
            for (r = 0; r < this.pendingCaptions.length; r++) t = this.pendingCaptions[r], t.startTime = t.startPts - o, t.startTime /= 9e4, t.endTime = t.endPts - o, t.endTime /= 9e4, s.captionStreams[t.stream] = !0, s.captions.push(t);
            for (r = 0; r < this.pendingMetadata.length; r++) i = this.pendingMetadata[r], i.cueTime = i.pts - o, i.cueTime /= 9e4, s.metadata.push(i);
            s.metadata.dispatchType = this.metadataStream.dispatchType, this.pendingTracks.length = 0, this.videoTrack = null, this.pendingBoxes.length = 0, this.pendingCaptions.length = 0, this.pendingBytes = 0, this.pendingMetadata.length = 0, this.trigger("data", s), this.emittedTracks >= this.numberOfTracks && (this.trigger("done"), this.emittedTracks = 0)
        }, a = function(e) {
            var t, i, o = this,
                d = !0;
            a.prototype.init.call(this), e = e || {}, this.baseMediaDecodeTime = e.baseMediaDecodeTime || 0, this.transmuxPipeline_ = {}, this.setupAacPipeline = function() {
                var t = {};
                this.transmuxPipeline_ = t, t.type = "aac", t.metadataStream = new g.MetadataStream, t.aacStream = new v, t.audioTimestampRolloverStream = new g.TimestampRolloverStream("audio"), t.timedMetadataTimestampRolloverStream = new g.TimestampRolloverStream("timed-metadata"), t.adtsStream = new y, t.coalesceStream = new s(e, t.metadataStream), t.headOfPipeline = t.aacStream, t.aacStream.pipe(t.audioTimestampRolloverStream).pipe(t.adtsStream), t.aacStream.pipe(t.timedMetadataTimestampRolloverStream).pipe(t.metadataStream).pipe(t.coalesceStream), t.metadataStream.on("timestamp", function(e) {
                    t.aacStream.setTimestamp(e.timeStamp)
                }), t.aacStream.on("data", function(e) {
                    "timed-metadata" !== e.type || t.audioSegmentStream || (i = i || {
                        timelineStartInfo: {
                            baseMediaDecodeTime: o.baseMediaDecodeTime
                        },
                        codec: "adts",
                        type: "audio"
                    }, t.coalesceStream.numberOfTracks++, t.audioSegmentStream = new r(i), t.adtsStream.pipe(t.audioSegmentStream).pipe(t.coalesceStream))
                }), t.coalesceStream.on("data", this.trigger.bind(this, "data")), t.coalesceStream.on("done", this.trigger.bind(this, "done"))
            }, this.setupTsPipeline = function() {
                var a = {};
                this.transmuxPipeline_ = a, a.type = "ts", a.metadataStream = new g.MetadataStream, a.packetStream = new g.TransportPacketStream, a.parseStream = new g.TransportParseStream, a.elementaryStream = new g.ElementaryStream, a.videoTimestampRolloverStream = new g.TimestampRolloverStream("video"), a.audioTimestampRolloverStream = new g.TimestampRolloverStream("audio"), a.timedMetadataTimestampRolloverStream = new g.TimestampRolloverStream("timed-metadata"), a.adtsStream = new y, a.h264Stream = new _, a.captionStream = new g.CaptionStream, a.coalesceStream = new s(e, a.metadataStream), a.headOfPipeline = a.packetStream, a.packetStream.pipe(a.parseStream).pipe(a.elementaryStream), a.elementaryStream.pipe(a.videoTimestampRolloverStream).pipe(a.h264Stream), a.elementaryStream.pipe(a.audioTimestampRolloverStream).pipe(a.adtsStream), a.elementaryStream.pipe(a.timedMetadataTimestampRolloverStream).pipe(a.metadataStream).pipe(a.coalesceStream), a.h264Stream.pipe(a.captionStream).pipe(a.coalesceStream), a.elementaryStream.on("data", function(s) {
                    var u;
                    if ("metadata" === s.type) {
                        for (u = s.tracks.length; u--;) t || "video" !== s.tracks[u].type ? i || "audio" !== s.tracks[u].type || (i = s.tracks[u], i.timelineStartInfo.baseMediaDecodeTime = o.baseMediaDecodeTime) : (t = s.tracks[u], t.timelineStartInfo.baseMediaDecodeTime = o.baseMediaDecodeTime);
                        t && !a.videoSegmentStream && (a.coalesceStream.numberOfTracks++, a.videoSegmentStream = new n(t, e), a.videoSegmentStream.on("timelineStartInfo", function(e) {
                            i && (i.timelineStartInfo = e, a.audioSegmentStream.setEarliestDts(e.dts))
                        }), a.videoSegmentStream.on("processedGopsInfo", o.trigger.bind(o, "gopInfo")), a.videoSegmentStream.on("baseMediaDecodeTime", function(e) {
                            i && a.audioSegmentStream.setVideoBaseMediaDecodeTime(e)
                        }), a.h264Stream.pipe(a.videoSegmentStream).pipe(a.coalesceStream)), i && !a.audioSegmentStream && (a.coalesceStream.numberOfTracks++, a.audioSegmentStream = new r(i), a.adtsStream.pipe(a.audioSegmentStream).pipe(a.coalesceStream))
                    }
                }), a.coalesceStream.on("data", this.trigger.bind(this, "data")), a.coalesceStream.on("done", this.trigger.bind(this, "done"))
            }, this.setBaseMediaDecodeTime = function(e) {
                var n = this.transmuxPipeline_;
                this.baseMediaDecodeTime = e, i && (i.timelineStartInfo.dts = undefined, i.timelineStartInfo.pts = undefined, l(i), i.timelineStartInfo.baseMediaDecodeTime = e, n.audioTimestampRolloverStream && n.audioTimestampRolloverStream.discontinuity()), t && (n.videoSegmentStream && (n.videoSegmentStream.gopCache_ = [], n.videoTimestampRolloverStream.discontinuity()), t.timelineStartInfo.dts = undefined, t.timelineStartInfo.pts = undefined, l(t), n.captionStream.reset(), t.timelineStartInfo.baseMediaDecodeTime = e), n.timedMetadataTimestampRolloverStream && n.timedMetadataTimestampRolloverStream.discontinuity()
            }, this.setAudioAppendStart = function(e) {
                i && this.transmuxPipeline_.audioSegmentStream.setAudioAppendStart(e)
            }, this.alignGopsWith = function(e) {
                t && this.transmuxPipeline_.videoSegmentStream && this.transmuxPipeline_.videoSegmentStream.alignGopsWith(e)
            }, this.push = function(e) {
                if (d) {
                    var t = u(e);
                    t && "aac" !== this.transmuxPipeline_.type ? this.setupAacPipeline() : t || "ts" === this.transmuxPipeline_.type || this.setupTsPipeline(), d = !1
                }
                this.transmuxPipeline_.headOfPipeline.push(e)
            }, this.flush = function() {
                d = !0, this.transmuxPipeline_.headOfPipeline.flush()
            }, this.resetCaptions = function() {
                this.transmuxPipeline_.captionStream && this.transmuxPipeline_.captionStream.reset()
            }
        }, a.prototype = new p, t.exports = {
            Transmuxer: a,
            VideoSegmentStream: n,
            AudioSegmentStream: r,
            AUDIO_PROPERTIES: S,
            VIDEO_PROPERTIES: w
        }
    }, {}],
    59: [function(e, t, i) {
        "use strict";
        var n = e(53),
            r = e(54).handleRollover,
            a = {};
        a.ts = e(52), a.aac = e(39);
        var s = function(e) {
            return e[0] === "I".charCodeAt(0) && e[1] === "D".charCodeAt(0) && e[2] === "3".charCodeAt(0)
        }, o = function(e, t) {
            for (var i, n = 0, r = 188; r < e.byteLength;) if (71 !== e[n] || 71 !== e[r]) n++, r++;
            else {
                switch (i = e.subarray(n, r), a.ts.parseType(i, t.pid)) {
                    case "pat":
                        t.pid || (t.pid = a.ts.parsePat(i));
                        break;
                    case "pmt":
                        t.table || (t.table = a.ts.parsePmt(i))
                }
                if (t.pid && t.table) return;
                n += 188, r += 188
            }
        }, u = function(e, t, i) {
            for (var n, r, s, o, u = 0, d = 188, l = !1; d < e.byteLength;) if (71 !== e[u] || 71 !== e[d]) u++, d++;
            else {
                switch (n = e.subarray(u, d), a.ts.parseType(n, t.pid)) {
                    case "pes":
                        r = a.ts.parsePesType(n, t.table), s = a.ts.parsePayloadUnitStartIndicator(n), "audio" === r && s && (o = a.ts.parsePesTime(n)) && (o.type = "audio", i.audio.push(o), l = !0)
                }
                if (l) break;
                u += 188, d += 188
            }
            for (d = e.byteLength, u = d - 188, l = !1; u >= 0;) if (71 !== e[u] || 71 !== e[d]) u--, d--;
            else {
                switch (n = e.subarray(u, d), a.ts.parseType(n, t.pid)) {
                    case "pes":
                        r = a.ts.parsePesType(n, t.table), s = a.ts.parsePayloadUnitStartIndicator(n), "audio" === r && s && (o = a.ts.parsePesTime(n)) && (o.type = "audio", i.audio.push(o), l = !0)
                }
                if (l) break;
                u -= 188, d -= 188
            }
        }, d = function(e, t, i) {
            for (var n, r, s, o, u, d, l, f = 0, c = 188, h = !1, p = {
                data: [],
                size: 0
            }; c < e.byteLength;) if (71 !== e[f] || 71 !== e[c]) f++, c++;
            else {
                switch (n = e.subarray(f, c), a.ts.parseType(n, t.pid)) {
                    case "pes":
                        if (r = a.ts.parsePesType(n, t.table), s = a.ts.parsePayloadUnitStartIndicator(n), "video" === r && (s && !h && (o = a.ts.parsePesTime(n)) && (o.type = "video", i.video.push(o), h = !0), !i.firstKeyFrame)) {
                            if (s && 0 !== p.size) {
                                for (u = new Uint8Array(p.size), d = 0; p.data.length;) l = p.data.shift(), u.set(l, d), d += l.byteLength;
                                a.ts.videoPacketContainsKeyFrame(u) && (i.firstKeyFrame = a.ts.parsePesTime(u), i.firstKeyFrame.type = "video"), p.size = 0
                            }
                            p.data.push(n), p.size += n.byteLength
                        }
                }
                if (h && i.firstKeyFrame) break;
                f += 188, c += 188
            }
            for (c = e.byteLength, f = c - 188, h = !1; f >= 0;) if (71 !== e[f] || 71 !== e[c]) f--, c--;
            else {
                switch (n = e.subarray(f, c), a.ts.parseType(n, t.pid)) {
                    case "pes":
                        r = a.ts.parsePesType(n, t.table), s = a.ts.parsePayloadUnitStartIndicator(n), "video" === r && s && (o = a.ts.parsePesTime(n)) && (o.type = "video", i.video.push(o), h = !0)
                }
                if (h) break;
                f -= 188, c -= 188
            }
        }, l = function(e, t) {
            if (e.audio && e.audio.length) {
                var i = t;
                void 0 === i && (i = e.audio[0].dts), e.audio.forEach(function(e) {
                    e.dts = r(e.dts, i), e.pts = r(e.pts, i), e.dtsTime = e.dts / 9e4, e.ptsTime = e.pts / 9e4
                })
            }
            if (e.video && e.video.length) {
                var n = t;
                if (void 0 === n && (n = e.video[0].dts), e.video.forEach(function(e) {
                    e.dts = r(e.dts, n), e.pts = r(e.pts, n), e.dtsTime = e.dts / 9e4, e.ptsTime = e.pts / 9e4
                }), e.firstKeyFrame) {
                    var a = e.firstKeyFrame;
                    a.dts = r(a.dts, n), a.pts = r(a.pts, n), a.dtsTime = a.dts / 9e4, a.ptsTime = a.dts / 9e4
                }
            }
        }, f = function(e) {
            for (var t, i = !1, n = 0, r = null, s = null, o = 0, u = 0; e.length - u >= 3;) {
                switch (a.aac.parseType(e, u)) {
                    case "timed-metadata":
                        if (e.length - u < 10) {
                            i = !0;
                            break
                        }
                        if ((o = a.aac.parseId3TagSize(e, u)) > e.length) {
                            i = !0;
                            break
                        }
                        null === s && (t = e.subarray(u, u + o), s = a.aac.parseAacTimestamp(t)), u += o;
                        break;
                    case "audio":
                        if (e.length - u < 7) {
                            i = !0;
                            break
                        }
                        if ((o = a.aac.parseAdtsSize(e, u)) > e.length) {
                            i = !0;
                            break
                        }
                        null === r && (t = e.subarray(u, u + o), r = a.aac.parseSampleRate(t)), n++, u += o;
                        break;
                    default:
                        u++
                }
                if (i) return null
            }
            if (null === r || null === s) return null;
            var d = 9e4 / r;
            return {
                audio: [{
                    type: "audio",
                    dts: s,
                    pts: s
                }, {
                    type: "audio",
                    dts: s + 1024 * n * d,
                    pts: s + 1024 * n * d
                }]
            }
        }, c = function(e) {
            var t = {
                pid: null,
                table: null
            }, i = {};
            o(e, t);
            for (var r in t.table) if (t.table.hasOwnProperty(r)) {
                var a = t.table[r];
                switch (a) {
                    case n.H264_STREAM_TYPE:
                        i.video = [], d(e, t, i), 0 === i.video.length && delete i.video;
                        break;
                    case n.ADTS_STREAM_TYPE:
                        i.audio = [], u(e, t, i), 0 === i.audio.length && delete i.audio
                }
            }
            return i
        }, h = function(e, t) {
            var i, n = s(e);
            return (i = n ? f(e) : c(e)) && (i.audio || i.video) ? (l(i, t), i) : null
        };
        t.exports = {
            inspect: h
        }
    }, {}],
    60: [function(e, t, i) {
        var n, r, a, s, o, u;
        n = function(e) {
            return 9e4 * e
        }, r = function(e, t) {
            return e * t
        }, a = function(e) {
            return e / 9e4
        }, s = function(e, t) {
            return e / t
        }, o = function(e, t) {
            return n(s(e, t))
        }, u = function(e, t) {
            return r(a(e), t)
        }, t.exports = {
            secondsToVideoTs: n,
            secondsToAudioTs: r,
            videoTsToSeconds: a,
            audioTsToSeconds: s,
            audioTsToVideoTs: o,
            videoTsToAudioTs: u
        }
    }, {}],
    61: [function(e, t, i) {
        "use strict";
        var n;
        n = function(e) {
            var t = e.byteLength,
                i = 0,
                n = 0;
            this.length = function() {
                return 8 * t
            }, this.bitsAvailable = function() {
                return 8 * t + n
            }, this.loadWord = function() {
                var r = e.byteLength - t,
                    a = new Uint8Array(4),
                    s = Math.min(4, t);
                if (0 === s) throw new Error("no bytes available");
                a.set(e.subarray(r, r + s)), i = new DataView(a.buffer).getUint32(0), n = 8 * s, t -= s
            }, this.skipBits = function(e) {
                var r;
                n > e ? (i <<= e, n -= e) : (e -= n, r = Math.floor(e / 8), e -= 8 * r, t -= r, this.loadWord(), i <<= e, n -= e)
            }, this.readBits = function(e) {
                var r = Math.min(n, e),
                    a = i >>> 32 - r;
                return n -= r, n > 0 ? i <<= r : t > 0 && this.loadWord(), r = e - r, r > 0 ? a << r | this.readBits(r) : a
            }, this.skipLeadingZeros = function() {
                var e;
                for (e = 0; e < n; ++e) if (0 != (i & 2147483648 >>> e)) return i <<= e, n -= e, e;
                return this.loadWord(), e + this.skipLeadingZeros()
            }, this.skipUnsignedExpGolomb = function() {
                this.skipBits(1 + this.skipLeadingZeros())
            }, this.skipExpGolomb = function() {
                this.skipBits(1 + this.skipLeadingZeros())
            }, this.readUnsignedExpGolomb = function() {
                var e = this.skipLeadingZeros();
                return this.readBits(e + 1) - 1
            }, this.readExpGolomb = function() {
                var e = this.readUnsignedExpGolomb();
                return 1 & e ? 1 + e >>> 1 : -1 * (e >>> 1)
            }, this.readBoolean = function() {
                return 1 === this.readBits(1)
            }, this.readUnsignedByte = function() {
                return this.readBits(8)
            }, this.loadWord()
        }, t.exports = n
    }, {}],
    62: [function(e, t, i) {
        "use strict";
        var n = function() {
            this.init = function() {
                var e = {};
                this.on = function(t, i) {
                    e[t] || (e[t] = []), e[t] = e[t].concat(i)
                }, this.off = function(t, i) {
                    var n;
                    return !!e[t] && (n = e[t].indexOf(i), e[t] = e[t].slice(), e[t].splice(n, 1), n > -1)
                }, this.trigger = function(t) {
                    var i, n, r, a;
                    if (i = e[t]) if (2 === arguments.length) for (r = i.length, n = 0; n < r; ++n) i[n].call(this, arguments[1]);
                    else {
                        for (a = [], n = arguments.length, n = 1; n < arguments.length; ++n) a.push(arguments[n]);
                        for (r = i.length, n = 0; n < r; ++n) i[n].apply(this, a)
                    }
                }, this.dispose = function() {
                    e = {}
                }
            }
        };
        n.prototype.pipe = function(e) {
            return this.on("data", function(t) {
                e.push(t)
            }), this.on("done", function(t) {
                e.flush(t)
            }), e
        }, n.prototype.push = function(e) {
            this.trigger("data", e)
        }, n.prototype.flush = function(e) {
            this.trigger("done", e)
        }, t.exports = n
    }, {}],
    63: [function(e, t, i) {
        ! function(e) {
            var n = /^((?:[a-zA-Z0-9+\-.]+:)?)(\/\/[^\/\;?#]*)?(.*?)??(;.*?)?(\?.*?)?(#.*?)?$/,
                r = /^([^\/;?#]*)(.*)$/,
                a = /(?:\/|^)\.(?=\/)/g,
                s = /(?:\/|^)\.\.\/(?!\.\.\/).*?(?=\/)/g,
                o = {
                    buildAbsoluteURL: function(e, t, i) {
                        if (i = i || {}, e = e.trim(), !(t = t.trim())) {
                            if (!i.alwaysNormalize) return e;
                            var n = this.parseURL(e);
                            if (!n) throw new Error("Error trying to parse base URL.");
                            return n.path = o.normalizePath(n.path), o.buildURLFromParts(n)
                        }
                        var a = this.parseURL(t);
                        if (!a) throw new Error("Error trying to parse relative URL.");
                        if (a.scheme) return i.alwaysNormalize ? (a.path = o.normalizePath(a.path), o.buildURLFromParts(a)) : t;
                        var s = this.parseURL(e);
                        if (!s) throw new Error("Error trying to parse base URL.");
                        if (!s.netLoc && s.path && "/" !== s.path[0]) {
                            var u = r.exec(s.path);
                            s.netLoc = u[1], s.path = u[2]
                        }
                        s.netLoc && !s.path && (s.path = "/");
                        var d = {
                            scheme: s.scheme,
                            netLoc: a.netLoc,
                            path: null,
                            params: a.params,
                            query: a.query,
                            fragment: a.fragment
                        };
                        if (!a.netLoc && (d.netLoc = s.netLoc, "/" !== a.path[0])) if (a.path) {
                            var l = s.path,
                                f = l.substring(0, l.lastIndexOf("/") + 1) + a.path;
                            d.path = o.normalizePath(f)
                        } else d.path = s.path, a.params || (d.params = s.params, a.query || (d.query = s.query));
                        return null === d.path && (d.path = i.alwaysNormalize ? o.normalizePath(a.path) : a.path), o.buildURLFromParts(d)
                    },
                    parseURL: function(e) {
                        var t = n.exec(e);
                        return t ? {
                            scheme: t[1] || "",
                            netLoc: t[2] || "",
                            path: t[3] || "",
                            params: t[4] || "",
                            query: t[5] || "",
                            fragment: t[6] || ""
                        } : null
                    },
                    normalizePath: function(e) {
                        for (e = e.split("").reverse().join("").replace(a, ""); e.length !== (e = e.replace(s, "")).length;);
                        return e.split("").reverse().join("")
                    },
                    buildURLFromParts: function(e) {
                        return e.scheme + e.netLoc + e.path + e.params + e.query + e.fragment
                    }
                };
            "object" == typeof i && "object" == typeof t ? t.exports = o : "function" == typeof define && define.amd ? define([], function() {
                return o
            }) : "object" == typeof i ? i.URLToolkit = o : e.URLToolkit = o
        }(this)
    }, {}],
    64: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var a = e(32),
                s = r(a),
                o = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                u = r(o),
                d = function(e) {
                    Object.defineProperties(e.frame, {
                        id: {
                            get: function() {
                                return u["default"].log.warn("cue.frame.id is deprecated. Use cue.value.key instead."), e.value.key
                            }
                        },
                        value: {
                            get: function() {
                                return u["default"].log.warn("cue.frame.value is deprecated. Use cue.value.data instead."), e.value.data
                            }
                        },
                        privateData: {
                            get: function() {
                                return u["default"].log.warn("cue.frame.privateData is deprecated. Use cue.value.data instead."), e.value.data
                            }
                        }
                    })
                }, l = function(e) {
                    undefined;
                    return isNaN(e) || Math.abs(e) === Infinity ? Number.MAX_VALUE : e
                }, f = function(e, t, i) {
                    var n = s["default"].WebKitDataCue || s["default"].VTTCue;
                    t && t.forEach(function(e) {
                        var t = e.stream;
                        this.inbandTextTracks_[t].addCue(new n(e.startTime + this.timestampOffset, e.endTime + this.timestampOffset, e.text))
                    }, e), i && function() {
                        var t = l(e.mediaSource_.duration);
                        i.forEach(function(e) {
                            var t = e.cueTime + this.timestampOffset;
                            e.frames.forEach(function(e) {
                                var i = new n(t, t, e.value || e.url || e.data || "");
                                i.frame = e, i.value = e, d(i), this.metadataTrack_.addCue(i)
                            }, this)
                        }, e), e.metadataTrack_ && e.metadataTrack_.cues && e.metadataTrack_.cues.length && function() {
                            for (var i = e.metadataTrack_.cues, n = [], r = 0; r < i.length; r++) i[r] && n.push(i[r]);
                            var a = n.reduce(function(e, t) {
                                    var i = e[t.startTime] || [];
                                    return i.push(t), e[t.startTime] = i, e
                                }, {}),
                                s = Object.keys(a).sort(function(e, t) {
                                    return Number(e) - Number(t)
                                });
                            s.forEach(function(e, i) {
                                var n = a[e],
                                    r = Number(s[i + 1]) || t;
                                n.forEach(function(e) {
                                    e.endTime = r
                                })
                            })
                        }()
                    }()
                };
            i["default"] = {
                addTextTrackData: f,
                durationOfVideo: l
            }, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    65: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function(e) {
            return /mp4a\.\d+.\d+/i.test(e)
        }, r = function(e) {
            return /avc1\.[\da-f]+/i.test(e)
        }, a = function(e) {
            var t = {
                type: "",
                parameters: {}
            }, i = e.trim().split(";");
            return t.type = i.shift().trim(), i.forEach(function(e) {
                var i = e.trim().split("=");
                if (i.length > 1) {
                    var n = i[0].replace(/"/g, "").trim(),
                        r = i[1].replace(/"/g, "").trim();
                    t.parameters[n] = r
                }
            }), t
        }, s = function(e) {
            return e.map(function(e) {
                return e.replace(/avc1\.(\d+)\.(\d+)/i, function(e, t, i) {
                    return "avc1." + ("00" + Number(t).toString(16)).slice(-2) + "00" + ("00" + Number(i).toString(16)).slice(-2)
                })
            })
        };
        i["default"] = {
            isAudioCodec: n,
            parseContentType: a,
            isVideoCodec: r,
            translateLegacyCodecs: s
        }, t.exports = i["default"]
    }, {}],
    66: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function(e, t, i) {
            var n = t.player_;
            if (i.captions && i.captions.length) {
                e.inbandTextTracks_ || (e.inbandTextTracks_ = {});
                for (var r in i.captionStreams) if (!e.inbandTextTracks_[r]) {
                    n.tech_.trigger({
                        type: "usage",
                        name: "hls-608"
                    });
                    var a = n.textTracks().getTrackById(r);
                    e.inbandTextTracks_[r] = a || n.addRemoteTextTrack({
                        kind: "captions",
                        id: r,
                        label: r
                    }, !1).track
                }
            }
            i.metadata && i.metadata.length && !e.metadataTrack_ && (e.metadataTrack_ = n.addRemoteTextTrack({
                kind: "metadata",
                label: "Timed Metadata"
            }, !1).track, e.metadataTrack_.inBandMetadataTrackDispatchType = i.metadata.dispatchType)
        };
        i["default"] = n, t.exports = i["default"]
    }, {}],
    67: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = {
            TIME_BETWEEN_CHUNKS: 1,
            BYTES_PER_CHUNK: 32768
        };
        i["default"] = n, t.exports = i["default"]
    }, {}],
    68: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                u = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, d = e(31),
                l = r(d),
                f = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                c = r(f),
                h = e(69),
                p = r(h),
                m = e(67),
                g = r(m),
                y = e(65),
                _ = function(e) {
                    function t() {
                        var e = this;
                        a(this, t), u(Object.getPrototypeOf(t.prototype), "constructor", this).call(this), this.sourceBuffers = [], this.readyState = "closed", this.on(["sourceopen", "webkitsourceopen"], function(t) {
                            e.swfObj = l["default"].getElementById(t.swfId), e.player_ = (0, c["default"])(e.swfObj.parentNode), e.tech_ = e.swfObj.tech, e.readyState = "open", e.tech_.on("seeking", function() {
                                for (var t = e.sourceBuffers.length; t--;) e.sourceBuffers[t].abort()
                            }), e.swfObj && e.swfObj.vjs_load()
                        })
                    }
                    return s(t, e), o(t, [{
                        key: "addSeekableRange_",
                        value: function() {}
                    }, {
                        key: "addSourceBuffer",
                        value: function(e) {
                            var t = (0, y.parseContentType)(e),
                                i = undefined;
                            if ("video/mp2t" !== t.type && "audio/mp2t" !== t.type) throw new Error("NotSupportedError (Video.js)");
                            return i = new p["default"](this), this.sourceBuffers.push(i), i
                        }
                    }, {
                        key: "endOfStream",
                        value: function(e) {
                            "network" === e ? this.tech_.error(2) : "decode" === e && this.tech_.error(3), "ended" !== this.readyState && (this.readyState = "ended", this.swfObj.vjs_endOfStream())
                        }
                    }]), t
                }(c["default"].EventTarget);
            i["default"] = _;
            try {
                Object.defineProperty(_.prototype, "duration", {
                    get: function() {
                        return this.swfObj ? this.swfObj.vjs_getProperty("duration") : NaN
                    },
                    set: function(e) {
                        var t = undefined,
                            i = this.swfObj.vjs_getProperty("duration");
                        if (this.swfObj.vjs_setProperty("duration", e), e < i) for (t = 0; t < this.sourceBuffers.length; t++) this.sourceBuffers[t].remove(e, i);
                        return e
                    }
                })
            } catch (b) {
                _.prototype.duration = NaN
            }
            for (var v in g["default"]) _[v] = g["default"][v];
            t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    69: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                u = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, d = e(32),
                l = r(d),
                f = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                c = r(f),
                h = e(46),
                p = r(h),
                m = e(72),
                g = r(m),
                y = e(66),
                _ = r(y),
                v = e(64),
                b = e(70),
                T = r(b),
                S = e(76),
                w = r(S),
                k = e(67),
                O = r(k),
                E = function() {
                    var t = undefined;
                    try {
                        t = e.resolve("./flash-transmuxer-worker")
                    } catch (i) {}
                    return t
                }, A = function(e) {
                    l["default"].setTimeout(e, O["default"].TIME_BETWEEN_CHUNKS)
                }, L = function() {
                    return Math.random().toString(36).slice(2, 8)
                }, P = function(e, t) {
                    ("number" != typeof t || t < 0) && (t = 0);
                    var i = Math.pow(10, t);
                    return Math.round(e * i) / i
                }, I = function(e) {
                    function t(e) {
                        var i = this;
                        a(this, t), u(Object.getPrototypeOf(t.prototype), "constructor", this).call(this);
                        var n = undefined;
                        this.chunkSize_ = O["default"].BYTES_PER_CHUNK, this.buffer_ = [], this.bufferSize_ = 0, this.basePtsOffset_ = NaN, this.mediaSource_ = e, this.audioBufferEnd_ = NaN, this.videoBufferEnd_ = NaN, this.updating = !1, this.timestampOffset_ = 0, n = l["default"].btoa(String.fromCharCode.apply(null, Array.prototype.slice.call(p["default"].getFlvHeader())));
                        var r = this.mediaSource_.player_.id().replace(/[^a-zA-Z0-9]/g, "_");
                        this.flashEncodedHeaderName_ = "vjs_flashEncodedHeader_" + r + L(), this.flashEncodedDataName_ = "vjs_flashEncodedData_" + r + L(), l["default"][this.flashEncodedHeaderName_] = function() {
                            return delete l["default"][i.flashEncodedHeaderName_], n
                        }, this.mediaSource_.swfObj.vjs_appendChunkReady(this.flashEncodedHeaderName_), this.transmuxer_ = (0, w["default"])(T["default"], E()), this.transmuxer_.postMessage({
                            action: "init",
                            options: {}
                        }), this.transmuxer_.onmessage = function(e) {
                            "data" === e.data.action && i.receiveBuffer_(e.data.segment)
                        }, this.one("updateend", function() {
                            i.mediaSource_.tech_.trigger("loadedmetadata")
                        }), Object.defineProperty(this, "timestampOffset", {
                            get: function() {
                                return this.timestampOffset_
                            },
                            set: function(e) {
                                "number" == typeof e && e >= 0 && (this.timestampOffset_ = e, this.mediaSource_.swfObj.vjs_discontinuity(), this.basePtsOffset_ = NaN, this.audioBufferEnd_ = NaN, this.videoBufferEnd_ = NaN, this.transmuxer_.postMessage({
                                    action: "reset"
                                }))
                            }
                        }), Object.defineProperty(this, "buffered", {
                            get: function() {
                                if (!(this.mediaSource_ && this.mediaSource_.swfObj && "vjs_getProperty" in this.mediaSource_.swfObj)) return c["default"].createTimeRange();
                                var e = this.mediaSource_.swfObj.vjs_getProperty("buffered");
                                return e && e.length && (e[0][0] = P(e[0][0], 3), e[0][1] = P(e[0][1], 3)), c["default"].createTimeRanges(e)
                            }
                        }), this.mediaSource_.player_.on("seeked", function() {
                            if ((0, g["default"])(0, Infinity, i.metadataTrack_), i.inbandTextTracks_) for (var e in i.inbandTextTracks_)(0, g["default"])(0, Infinity, i.inbandTextTracks_[e])
                        });
                        var s = this.onHlsReset_.bind(this);
                        this.mediaSource_.player_.tech_.on("hls-reset", s), this.mediaSource_.player_.tech_.hls.on("dispose", function() {
                            i.transmuxer_.terminate(), i.mediaSource_.player_.tech_.off("hls-reset", s)
                        })
                    }
                    return s(t, e), o(t, [{
                        key: "appendBuffer",
                        value: function(e) {
                            var t = undefined;
                            if (this.updating) throw t = new Error("SourceBuffer.append() cannot be called while an update is in progress"), t.name = "InvalidStateError", t.code = 11, t;
                            this.updating = !0, this.mediaSource_.readyState = "open", this.trigger({
                                type: "update"
                            }), this.transmuxer_.postMessage({
                                action: "push",
                                data: e.buffer,
                                byteOffset: e.byteOffset,
                                byteLength: e.byteLength
                            }, [e.buffer]), this.transmuxer_.postMessage({
                                action: "flush"
                            })
                        }
                    }, {
                        key: "abort",
                        value: function() {
                            this.buffer_ = [], this.bufferSize_ = 0, this.mediaSource_.swfObj.vjs_abort(), this.updating && (this.updating = !1, this.trigger({
                                type: "updateend"
                            }))
                        }
                    }, {
                        key: "remove",
                        value: function(e, t) {
                            if ((0, g["default"])(e, t, this.metadataTrack_), this.inbandTextTracks_) for (var i in this.inbandTextTracks_)(0, g["default"])(e, t, this.inbandTextTracks_[i]);
                            this.trigger({
                                type: "update"
                            }), this.trigger({
                                type: "updateend"
                            })
                        }
                    }, {
                        key: "receiveBuffer_",
                        value: function(e) {
                            var t = this;
                            (0, _["default"])(this, this.mediaSource_, e), (0, v.addTextTrackData)(this, e.captions, e.metadata), A(function() {
                                var i = t.convertTagsToData_(e);
                                0 === t.buffer_.length && A(t.processBuffer_.bind(t)), i && (t.buffer_.push(i), t.bufferSize_ += i.byteLength)
                            })
                        }
                    }, {
                        key: "processBuffer_",
                        value: function() {
                            var e = this,
                                t = O["default"].BYTES_PER_CHUNK;
                            if (!this.buffer_.length) return void(!1 !== this.updating && (this.updating = !1, this.trigger({
                                type: "updateend"
                            })));
                            var i = this.buffer_[0].subarray(0, t);
                            i.byteLength < t || this.buffer_[0].byteLength === t ? this.buffer_.shift() : this.buffer_[0] = this.buffer_[0].subarray(t), this.bufferSize_ -= i.byteLength;
                            for (var n = [], r = i.byteLength, a = 0; a < r; a++) n.push(String.fromCharCode(i[a]));
                            var s = l["default"].btoa(n.join(""));
                            l["default"][this.flashEncodedDataName_] = function() {
                                return A(e.processBuffer_.bind(e)), delete l["default"][e.flashEncodedDataName_], s
                            }, this.mediaSource_.swfObj.vjs_appendChunkReady(this.flashEncodedDataName_)
                        }
                    }, {
                        key: "convertTagsToData_",
                        value: function(e) {
                            var t = 0,
                                i = this.mediaSource_.tech_,
                                n = 0,
                                r = undefined,
                                a = e.tags.videoTags,
                                s = e.tags.audioTags;
                            if (isNaN(this.basePtsOffset_) && (a.length || s.length)) {
                                var o = a[0] || {
                                    pts: Infinity
                                }, u = s[0] || {
                                    pts: Infinity
                                };
                                this.basePtsOffset_ = Math.min(u.pts, o.pts)
                            }
                            i.seeking() && (this.videoBufferEnd_ = NaN, this.audioBufferEnd_ = NaN), isNaN(this.videoBufferEnd_) ? (i.buffered().length && (n = i.buffered().end(0) - this.timestampOffset), i.seeking() && (n = Math.max(n, i.currentTime() - this.timestampOffset)), n *= 1e3, n += this.basePtsOffset_) : n = this.videoBufferEnd_ + .1;
                            var d = a.length;
                            if (d && a[d - 1].pts >= n) {
                                for (; --d;) {
                                    var l = a[d];
                                    if (!(l.pts > n) && (l.keyFrame || l.metaDataTag)) break
                                }
                                for (; d;) {
                                    if (!a[d - 1].metaDataTag) break;
                                    d--
                                }
                            }
                            var f = a.slice(d),
                                c = undefined;
                            for (c = isNaN(this.audioBufferEnd_) ? n : this.audioBufferEnd_ + .1, f.length && (c = Math.min(c, f[0].pts)), d = 0; d < s.length && !(s[d].pts >= c);) d++;
                            var h = s.slice(d);
                            h.length && (this.audioBufferEnd_ = h[h.length - 1].pts), f.length && (this.videoBufferEnd_ = f[f.length - 1].pts);
                            var p = this.getOrderedTags_(f, h);
                            if (0 !== p.length) {
                                if (p[0].pts < n && i.seeking()) {
                                    var m = i.currentTime(),
                                        g = (n - p[0].pts) / 1e3,
                                        y = m - g;
                                    y < 1 / 30 && (y = 0);
                                    try {
                                        this.mediaSource_.swfObj.vjs_adjustCurrentTime(y)
                                    } catch (b) {}
                                }
                                for (var _ = 0; _ < p.length; _++) t += p[_].bytes.byteLength;
                                r = new Uint8Array(t);
                                for (var _ = 0, v = 0; _ < p.length; _++) r.set(p[_].bytes, v), v += p[_].bytes.byteLength;
                                return r
                            }
                        }
                    }, {
                        key: "getOrderedTags_",
                        value: function(e, t) {
                            for (var i = undefined, n = []; e.length || t.length;) i = e.length ? t.length && t[0].dts < e[0].dts ? t.shift() : e.shift() : t.shift(), n.push(i);
                            return n
                        }
                    }, {
                        key: "onHlsReset_",
                        value: function() {
                            this.transmuxer_.postMessage({
                                action: "resetCaptions"
                            })
                        }
                    }]), t
                }(c["default"].EventTarget);
            i["default"] = I, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    70: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var a = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = e(32),
            o = n(s),
            u = e(46),
            d = n(u),
            l = function(e) {
                e.on("data", function(e) {
                    o["default"].postMessage({
                        action: "data",
                        segment: e
                    })
                }), e.on("done", function(e) {
                    o["default"].postMessage({
                        action: "done"
                    })
                })
            }, f = function() {
                function e(t) {
                    r(this, e), this.options = t || {}, this.init()
                }
                return a(e, [{
                    key: "init",
                    value: function() {
                        this.transmuxer && this.transmuxer.dispose(), this.transmuxer = new d["default"].Transmuxer(this.options), l(this.transmuxer)
                    }
                }, {
                    key: "push",
                    value: function(e) {
                        var t = new Uint8Array(e.data, e.byteOffset, e.byteLength);
                        this.transmuxer.push(t)
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.init()
                    }
                }, {
                    key: "flush",
                    value: function() {
                        this.transmuxer.flush()
                    }
                }, {
                    key: "resetCaptions",
                    value: function() {
                        this.transmuxer.resetCaptions()
                    }
                }]), e
            }(),
            c = function(e) {
                e.onmessage = function(e) {
                    if ("init" === e.data.action && e.data.options) return void(this.messageHandlers = new f(e.data.options));
                    this.messageHandlers || (this.messageHandlers = new f), e.data && e.data.action && "init" !== e.data.action && this.messageHandlers[e.data.action] && this.messageHandlers[e.data.action](e.data)
                }
            };
        i["default"] = function(e) {
            return new c(e)
        }, t.exports = i["default"]
    }, {}],
    71: [function(e, t, i) {
        (function(n) {
            "use strict";

            function r(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function a(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function s(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var o = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                u = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, d = e(32),
                l = r(d),
                f = e(31),
                c = r(f),
                h = "undefined" != typeof window ? window.videojs : void 0 !== n ? n.videojs : null,
                p = r(h),
                m = e(75),
                g = r(m),
                y = e(64),
                _ = e(65),
                v = function(e) {
                    function t() {
                        var e = this;
                        a(this, t), u(Object.getPrototypeOf(t.prototype), "constructor", this).call(this);
                        var i = undefined;
                        this.nativeMediaSource_ = new l["default"].MediaSource;
                        for (i in this.nativeMediaSource_) i in t.prototype || "function" != typeof this.nativeMediaSource_[i] || (this[i] = this.nativeMediaSource_[i].bind(this.nativeMediaSource_));
                        this.duration_ = NaN, Object.defineProperty(this, "duration", {
                            get: function() {
                                return this.duration_ === Infinity ? this.duration_ : this.nativeMediaSource_.duration
                            },
                            set: function(e) {
                                if (this.duration_ = e, e !== Infinity) return void(this.nativeMediaSource_.duration = e)
                            }
                        }), Object.defineProperty(this, "seekable", {
                            get: function() {
                                return this.duration_ === Infinity ? p["default"].createTimeRanges([
                                    [0, this.nativeMediaSource_.duration]
                                ]) : this.nativeMediaSource_.seekable
                            }
                        }), Object.defineProperty(this, "readyState", {
                            get: function() {
                                return this.nativeMediaSource_.readyState
                            }
                        }), Object.defineProperty(this, "activeSourceBuffers", {
                            get: function() {
                                return this.activeSourceBuffers_
                            }
                        }), this.sourceBuffers = [], this.activeSourceBuffers_ = [], this.updateActiveSourceBuffers_ = function() {
                            if (e.activeSourceBuffers_.length = 0, 1 === e.sourceBuffers.length) {
                                var t = e.sourceBuffers[0];
                                return t.appendAudioInitSegment_ = !0, t.audioDisabled_ = !t.audioCodec_, void e.activeSourceBuffers_.push(t)
                            }
                            for (var i = !1, n = !0, r = 0; r < e.player_.audioTracks().length; r++) {
                                var a = e.player_.audioTracks()[r];
                                if (a.enabled && "main" !== a.kind) {
                                    i = !0, n = !1;
                                    break
                                }
                            }
                            e.sourceBuffers.forEach(function(t) {
                                if (t.appendAudioInitSegment_ = !0, t.videoCodec_ && t.audioCodec_) t.audioDisabled_ = i;
                                else if (t.videoCodec_ && !t.audioCodec_) t.audioDisabled_ = !0, n = !1;
                                else if (!t.videoCodec_ && t.audioCodec_ && (t.audioDisabled_ = n, n)) return;
                                e.activeSourceBuffers_.push(t)
                            })
                        }, this.onPlayerMediachange_ = function() {
                            e.sourceBuffers.forEach(function(e) {
                                e.appendAudioInitSegment_ = !0
                            })
                        }, this.onHlsReset_ = function() {
                            e.sourceBuffers.forEach(function(e) {
                                e.transmuxer_ && e.transmuxer_.postMessage({
                                    action: "resetCaptions"
                                })
                            })
                        }, this.onHlsSegmentTimeMapping_ = function(t) {
                            e.sourceBuffers.forEach(function(e) {
                                return e.timeMapping_ = t.mapping
                            })
                        }, ["sourceopen", "sourceclose", "sourceended"].forEach(function(e) {
                            this.nativeMediaSource_.addEventListener(e, this.trigger.bind(this))
                        }, this), this.on("sourceopen", function(t) {
                            var i = c["default"].querySelector('[src="' + e.url_ + '"]');
                            i && (e.player_ = (0, p["default"])(i.parentNode), e.player_.tech_.on("hls-reset", e.onHlsReset_), e.player_.tech_.on("hls-segment-time-mapping", e.onHlsSegmentTimeMapping_), e.player_.audioTracks && e.player_.audioTracks() && (e.player_.audioTracks().on("change", e.updateActiveSourceBuffers_), e.player_.audioTracks().on("addtrack", e.updateActiveSourceBuffers_), e.player_.audioTracks().on("removetrack", e.updateActiveSourceBuffers_)), e.player_.on("mediachange", e.onPlayerMediachange_))
                        }), this.on("sourceended", function(t) {
                            for (var i = (0, y.durationOfVideo)(e.duration), n = 0; n < e.sourceBuffers.length; n++) {
                                var r = e.sourceBuffers[n],
                                    a = r.metadataTrack_ && r.metadataTrack_.cues;
                                a && a.length && (a[a.length - 1].endTime = i)
                            }
                        }), this.on("sourceclose", function(e) {
                            this.sourceBuffers.forEach(function(e) {
                                e.transmuxer_ && e.transmuxer_.terminate()
                            }), this.sourceBuffers.length = 0, this.player_ && (this.player_.audioTracks && this.player_.audioTracks() && (this.player_.audioTracks().off("change", this.updateActiveSourceBuffers_), this.player_.audioTracks().off("addtrack", this.updateActiveSourceBuffers_), this.player_.audioTracks().off("removetrack", this.updateActiveSourceBuffers_)), this.player_.el_ && (this.player_.off("mediachange", this.onPlayerMediachange_), this.player_.tech_.off("hls-reset", this.onHlsReset_), this.player_.tech_.off("hls-segment-time-mapping", this.onHlsSegmentTimeMapping_)))
                        })
                    }
                    return s(t, e), o(t, [{
                        key: "addSeekableRange_",
                        value: function(e, t) {
                            var i = undefined;
                            if (this.duration !== Infinity) throw i = new Error("MediaSource.addSeekableRange() can only be invoked when the duration is Infinity"), i.name = "InvalidStateError", i.code = 11, i;
                            (t > this.nativeMediaSource_.duration || isNaN(this.nativeMediaSource_.duration)) && (this.nativeMediaSource_.duration = t)
                        }
                    }, {
                        key: "addSourceBuffer",
                        value: function(e) {
                            var t = undefined,
                                i = (0, _.parseContentType)(e);
                            if (/^(video|audio)\/mp2t$/i.test(i.type)) {
                                var n = [];
                                i.parameters && i.parameters.codecs && (n = i.parameters.codecs.split(","), n = (0, _.translateLegacyCodecs)(n), n = n.filter(function(e) {
                                    return (0, _.isAudioCodec)(e) || (0, _.isVideoCodec)(e)
                                })), 0 === n.length && (n = ["avc1.4d400d", "mp4a.40.2"]), t = new g["default"](this, n), 0 !== this.sourceBuffers.length && (this.sourceBuffers[0].createRealSourceBuffers_(), t.createRealSourceBuffers_(), this.sourceBuffers[0].audioDisabled_ = !0)
                            } else t = this.nativeMediaSource_.addSourceBuffer(e);
                            return this.sourceBuffers.push(t), t
                        }
                    }]), t
                }(p["default"].EventTarget);
            i["default"] = v, t.exports = i["default"]
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    72: [function(e, t, i) {
        "use strict";
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var n = function(e, t, i) {
            var n = undefined,
                r = undefined;
            if (i && i.cues) for (n = i.cues.length; n--;) r = i.cues[n], r.startTime <= t && r.endTime >= e && i.removeCue(r)
        };
        i["default"] = n, t.exports = i["default"]
    }, {}],
    73: [function(e, t, i) {
        "use strict";

        function n(e) {
            return e && e.__esModule ? e : {
                "default": e
            }
        }
        function r(e, t) {
            if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
        }
        Object.defineProperty(i, "__esModule", {
            value: !0
        });
        var a = function() {
                function e(e, t) {
                    for (var i = 0; i < t.length; i++) {
                        var n = t[i];
                        n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                    }
                }
                return function(t, i, n) {
                    return i && e(t.prototype, i), n && e(t, n), t
                }
            }(),
            s = e(32),
            o = n(s),
            u = e(55),
            d = n(u),
            l = function(e) {
                e.on("data", function(e) {
                    var t = e.initSegment;
                    e.initSegment = {
                        data: t.buffer,
                        byteOffset: t.byteOffset,
                        byteLength: t.byteLength
                    };
                    var i = e.data;
                    e.data = i.buffer, o["default"].postMessage({
                        action: "data",
                        segment: e,
                        byteOffset: i.byteOffset,
                        byteLength: i.byteLength
                    }, [e.data])
                }), e.captionStream && e.captionStream.on("data", function(e) {
                    o["default"].postMessage({
                        action: "caption",
                        data: e
                    })
                }), e.on("done", function(e) {
                    o["default"].postMessage({
                        action: "done"
                    })
                }), e.on("gopInfo", function(e) {
                    o["default"].postMessage({
                        action: "gopInfo",
                        gopInfo: e
                    })
                })
            }, f = function() {
                function e(t) {
                    r(this, e), this.options = t || {}, this.init()
                }
                return a(e, [{
                    key: "init",
                    value: function() {
                        this.transmuxer && this.transmuxer.dispose(), this.transmuxer = new d["default"].Transmuxer(this.options), l(this.transmuxer)
                    }
                }, {
                    key: "push",
                    value: function(e) {
                        var t = new Uint8Array(e.data, e.byteOffset, e.byteLength);
                        this.transmuxer.push(t)
                    }
                }, {
                    key: "reset",
                    value: function() {
                        this.init()
                    }
                }, {
                    key: "setTimestampOffset",
                    value: function(e) {
                        var t = e.timestampOffset || 0;
                        this.transmuxer.setBaseMediaDecodeTime(Math.round(9e4 * t))
                    }
                }, {
                    key: "setAudioAppendStart",
                    value: function(e) {
                        this.transmuxer.setAudioAppendStart(Math.ceil(9e4 * e.appendStart))
                    }
                }, {
                    key: "flush",
                    value: function(e) {
                        this.transmuxer.flush()
                    }
                }, {
                    key: "resetCaptions",
                    value: function() {
                        this.transmuxer.resetCaptions()
                    }
                }, {
                    key: "alignGopsWith",
                    value: function(e) {
                        this.transmuxer.alignGopsWith(e.gopsToAlignWith.slice())
                    }
                }]), e
            }(),
            c = function(e) {
                e.onmessage = function(e) {
                    if ("init" === e.data.action && e.data.options) return void(this.messageHandlers = new f(e.data.options));
                    this.messageHandlers || (this.messageHandlers = new f), e.data && e.data.action && "init" !== e.data.action && this.messageHandlers[e.data.action] && this.messageHandlers[e.data.action](e.data)
                }
            };
        i["default"] = function(e) {
            return new c(e)
        }, t.exports = i["default"]
    }, {}],
    74: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var r = e(32),
                a = n(r),
                s = e(68),
                o = n(s),
                u = e(71),
                d = n(u),
                l = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                f = n(l),
                c = 0,
                h = {
                    mode: "auto"
                };
            f["default"].mediaSources = {};
            var p = function(e, t) {
                var i = f["default"].mediaSources[e];
                if (!i) throw new Error("Media Source not found (Video.js)");
                i.trigger({
                    type: "sourceopen",
                    swfId: t
                })
            }, m = function() {
                return !!a["default"].MediaSource && !! a["default"].MediaSource.isTypeSupported && a["default"].MediaSource.isTypeSupported('video/mp4;codecs="avc1.4d400d,mp4a.40.2"')
            }, g = function(e) {
                var t = f["default"].mergeOptions(h, e);
                if (this.MediaSource = {
                    open: p,
                    supportsNativeMediaSources: m
                }, "html5" === t.mode || "auto" === t.mode && m()) return new d["default"];
                if (f["default"].getTech("Flash")) return new o["default"];
                throw new Error("Cannot use Flash or Html5 to create a MediaSource for this video")
            };
            i.MediaSource = g, g.open = p, g.supportsNativeMediaSources = m;
            var y = {
                createObjectURL: function(e) {
                    var t = undefined;
                    return e instanceof d["default"] ? (t = a["default"].URL.createObjectURL(e.nativeMediaSource_), e.url_ = t, t) : e instanceof o["default"] ? (t = "blob:vjs-media-source/" + c, c++, f["default"].mediaSources[t] = e, t) : (t = a["default"].URL.createObjectURL(e), e.url_ = t, t)
                }
            };
            i.URL = y, f["default"].MediaSource = g, f["default"].URL = y
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    75: [function(e, t, i) {
        (function(t) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            Object.defineProperty(i, "__esModule", {
                value: !0
            });
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = "undefined" != typeof window ? window.videojs : void 0 !== t ? t.videojs : null,
                d = n(u),
                l = e(66),
                f = n(l),
                c = e(72),
                h = n(c),
                p = e(64),
                m = e(76),
                g = n(m),
                y = e(73),
                _ = n(y),
                v = e(65),
                b = function() {
                    var t = undefined;
                    try {
                        t = e.resolve("./transmuxer-worker")
                    } catch (i) {}
                    return t
                }, T = function(e, t) {
                    var i = e.addSourceBuffer(t),
                        n = Object.create(null);
                    n.updating = !1, n.realBuffer_ = i;
                    for (var r in i)! function(e) {
                        "function" == typeof i[e] ? n[e] = function() {
                            return i[e].apply(i, arguments)
                        } : "undefined" == typeof n[e] && Object.defineProperty(n, e, {
                            get: function() {
                                return i[e]
                            },
                            set: function(t) {
                                return i[e] = t
                            }
                        })
                    }(r);
                    return n
                }, S = function(e, t, i) {
                    if (!t || !e.length) return [];
                    var n = Math.ceil(9e4 * (t.currentTime() - i + 3)),
                        r = undefined;
                    for (r = 0; r < e.length && !(e[r].pts > n); r++);
                    return e.slice(r)
                };
            i.gopsSafeToAlignWith = S;
            var w = function(e, t, i) {
                if (!t.length) return e;
                if (i) return t.slice();
                var n = t[0].pts,
                    r = 0;
                for (r; r < e.length && !(e[r].pts >= n); r++);
                return e.slice(0, r).concat(t)
            };
            i.updateGopBuffer = w;
            var k = function(e, t, i, n) {
                for (var r = Math.ceil(9e4 * (t - n)), a = Math.ceil(9e4 * (i - n)), s = e.slice(), o = e.length; o-- && !(e[o].pts <= a););
                if (-1 === o) return s;
                for (var u = o + 1; u-- && !(e[u].pts <= r););
                return u = Math.max(u, 0), s.splice(u, o - u + 1), s
            };
            i.removeGopBuffer = k;
            var O = function(e) {
                function t(e, i) {
                    var n = this;
                    r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, d["default"].EventTarget), this.timestampOffset_ = 0, this.pendingBuffers_ = [], this.bufferUpdating_ = !1, this.mediaSource_ = e, this.codecs_ = i, this.audioCodec_ = null, this.videoCodec_ = null, this.audioDisabled_ = !1, this.appendAudioInitSegment_ = !0, this.gopBuffer_ = [], this.timeMapping_ = 0, this.safeAppend_ = d["default"].browser.IE_VERSION >= 11;
                    var a = {
                        remux: !1,
                        alignGopsAtEnd: this.safeAppend_
                    };
                    this.codecs_.forEach(function(e) {
                        (0, v.isAudioCodec)(e) ? n.audioCodec_ = e : (0, v.isVideoCodec)(e) && (n.videoCodec_ = e)
                    }), this.transmuxer_ = (0, g["default"])(_["default"], b()), this.transmuxer_.postMessage({
                        action: "init",
                        options: a
                    }), this.transmuxer_.onmessage = function(e) {
                        return "data" === e.data.action ? n.data_(e) : "done" === e.data.action ? n.done_(e) : "gopInfo" === e.data.action ? n.appendGopInfo_(e) : void 0
                    }, Object.defineProperty(this, "timestampOffset", {
                        get: function() {
                            return this.timestampOffset_
                        },
                        set: function(e) {
                            "number" == typeof e && e >= 0 && (this.timestampOffset_ = e, this.appendAudioInitSegment_ = !0, this.gopBuffer_.length = 0, this.timeMapping_ = 0, this.transmuxer_.postMessage({
                                action: "setTimestampOffset",
                                timestampOffset: e
                            }))
                        }
                    }), Object.defineProperty(this, "appendWindowStart", {
                        get: function() {
                            return (this.videoBuffer_ || this.audioBuffer_).appendWindowStart
                        },
                        set: function(e) {
                            this.videoBuffer_ && (this.videoBuffer_.appendWindowStart = e), this.audioBuffer_ && (this.audioBuffer_.appendWindowStart = e)
                        }
                    }), Object.defineProperty(this, "updating", {
                        get: function() {
                            return !!(this.bufferUpdating_ || !this.audioDisabled_ && this.audioBuffer_ && this.audioBuffer_.updating || this.videoBuffer_ && this.videoBuffer_.updating)
                        }
                    }), Object.defineProperty(this, "buffered", {
                        get: function() {
                            var e = null,
                                t = null,
                                i = 0,
                                n = [],
                                r = [];
                            if (!this.videoBuffer_ && !this.audioBuffer_) return d["default"].createTimeRange();
                            if (!this.videoBuffer_) return this.audioBuffer_.buffered;
                            if (!this.audioBuffer_) return this.videoBuffer_.buffered;
                            if (this.audioDisabled_) return this.videoBuffer_.buffered;
                            if (0 === this.videoBuffer_.buffered.length && 0 === this.audioBuffer_.buffered.length) return d["default"].createTimeRange();
                            for (var a = this.videoBuffer_.buffered, s = this.audioBuffer_.buffered, o = a.length; o--;) n.push({
                                time: a.start(o),
                                type: "start"
                            }), n.push({
                                time: a.end(o),
                                type: "end"
                            });
                            for (o = s.length; o--;) n.push({
                                time: s.start(o),
                                type: "start"
                            }), n.push({
                                time: s.end(o),
                                type: "end"
                            });
                            for (n.sort(function(e, t) {
                                return e.time - t.time
                            }), o = 0; o < n.length; o++) "start" === n[o].type ? 2 === ++i && (e = n[o].time) : "end" === n[o].type && 1 === --i && (t = n[o].time), null !== e && null !== t && (r.push([e, t]), e = null, t = null);
                            return d["default"].createTimeRanges(r)
                        }
                    })
                }
                return a(t, e), s(t, [{
                    key: "data_",
                    value: function(e) {
                        var t = e.data.segment;
                        t.data = new Uint8Array(t.data, e.data.byteOffset, e.data.byteLength), t.initSegment = new Uint8Array(t.initSegment.data, t.initSegment.byteOffset, t.initSegment.byteLength), (0, f["default"])(this, this.mediaSource_, t), this.pendingBuffers_.push(t)
                    }
                }, {
                    key: "done_",
                    value: function(e) {
                        if ("closed" === this.mediaSource_.readyState) return void(this.pendingBuffers_.length = 0);
                        this.processPendingSegments_()
                    }
                }, {
                    key: "createRealSourceBuffers_",
                    value: function() {
                        var e = this,
                            t = ["audio", "video"];
                        t.forEach(function(i) {
                            if (e[i + "Codec_"] && !e[i + "Buffer_"]) {
                                var n = null;
                                if (e.mediaSource_[i + "Buffer_"]) n = e.mediaSource_[i + "Buffer_"], n.updating = !1;
                                else {
                                    var r = i + "Codec_",
                                        a = i + '/mp4;codecs="' + e[r] + '"';
                                    n = T(e.mediaSource_.nativeMediaSource_, a), e.mediaSource_[i + "Buffer_"] = n
                                }
                                e[i + "Buffer_"] = n, ["update", "updatestart", "updateend"].forEach(function(r) {
                                    n.addEventListener(r, function() {
                                        if ("audio" !== i || !e.audioDisabled_) {
                                            "updateend" === r && (e[i + "Buffer_"].updating = !1);
                                            return t.every(function(t) {
                                                return !("audio" !== t || !e.audioDisabled_) || (i === t || !e[t + "Buffer_"] || !e[t + "Buffer_"].updating)
                                            }) ? e.trigger(r) : void 0
                                        }
                                    })
                                })
                            }
                        })
                    }
                }, {
                    key: "appendBuffer",
                    value: function(e) {
                        if (this.bufferUpdating_ = !0, this.audioBuffer_ && this.audioBuffer_.buffered.length) {
                            var t = this.audioBuffer_.buffered;
                            this.transmuxer_.postMessage({
                                action: "setAudioAppendStart",
                                appendStart: t.end(t.length - 1)
                            })
                        }
                        this.videoBuffer_ && this.transmuxer_.postMessage({
                            action: "alignGopsWith",
                            gopsToAlignWith: S(this.gopBuffer_, this.mediaSource_.player_, this.timeMapping_)
                        }), this.transmuxer_.postMessage({
                            action: "push",
                            data: e.buffer,
                            byteOffset: e.byteOffset,
                            byteLength: e.byteLength
                        }, [e.buffer]), this.transmuxer_.postMessage({
                            action: "flush"
                        })
                    }
                }, {
                    key: "appendGopInfo_",
                    value: function(e) {
                        this.gopBuffer_ = w(this.gopBuffer_, e.data.gopInfo, this.safeAppend_)
                    }
                }, {
                    key: "remove",
                    value: function(e, t) {
                        if (this.videoBuffer_ && (this.videoBuffer_.updating = !0, this.videoBuffer_.remove(e, t), this.gopBuffer_ = k(this.gopBuffer_, e, t, this.timeMapping_)), !this.audioDisabled_ && this.audioBuffer_ && (this.audioBuffer_.updating = !0, this.audioBuffer_.remove(e, t)), (0, h["default"])(e, t, this.metadataTrack_), this.inbandTextTracks_) for (var i in this.inbandTextTracks_)(0, h["default"])(e, t, this.inbandTextTracks_[i])
                    }
                }, {
                    key: "processPendingSegments_",
                    value: function() {
                        var e = {
                            video: {
                                segments: [],
                                bytes: 0
                            },
                            audio: {
                                segments: [],
                                bytes: 0
                            },
                            captions: [],
                            metadata: []
                        };
                        e = this.pendingBuffers_.reduce(function(e, t) {
                            var i = t.type,
                                n = t.data,
                                r = t.initSegment;
                            return e[i].segments.push(n), e[i].bytes += n.byteLength, e[i].initSegment = r, t.captions && (e.captions = e.captions.concat(t.captions)), t.info && (e[i].info = t.info), t.metadata && (e.metadata = e.metadata.concat(t.metadata)), e
                        }, e), this.videoBuffer_ || this.audioBuffer_ || (0 === e.video.bytes && (this.videoCodec_ = null), 0 === e.audio.bytes && (this.audioCodec_ = null), this.createRealSourceBuffers_()), e.audio.info && this.mediaSource_.trigger({
                            type: "audioinfo",
                            info: e.audio.info
                        }), e.video.info && this.mediaSource_.trigger({
                            type: "videoinfo",
                            info: e.video.info
                        }), this.appendAudioInitSegment_ && (!this.audioDisabled_ && this.audioBuffer_ && (e.audio.segments.unshift(e.audio.initSegment), e.audio.bytes += e.audio.initSegment.byteLength), this.appendAudioInitSegment_ = !1);
                        var t = !1;
                        this.videoBuffer_ && e.video.bytes ? (e.video.segments.unshift(e.video.initSegment), e.video.bytes += e.video.initSegment.byteLength, this.concatAndAppendSegments_(e.video, this.videoBuffer_), (0, p.addTextTrackData)(this, e.captions, e.metadata)) : !this.videoBuffer_ || !this.audioDisabled_ && this.audioBuffer_ || (t = !0), !this.audioDisabled_ && this.audioBuffer_ && this.concatAndAppendSegments_(e.audio, this.audioBuffer_), this.pendingBuffers_.length = 0, t && this.trigger("updateend"), this.bufferUpdating_ = !1
                    }
                }, {
                    key: "concatAndAppendSegments_",
                    value: function(e, t) {
                        var i = 0,
                            n = undefined;
                        if (e.bytes) {
                            n = new Uint8Array(e.bytes), e.segments.forEach(function(e) {
                                n.set(e, i), i += e.byteLength
                            });
                            try {
                                t.updating = !0, t.appendBuffer(n)
                            } catch (r) {
                                this.mediaSource_.player_ && this.mediaSource_.player_.error({
                                    code: -3,
                                    type: "APPEND_BUFFER_ERR",
                                    message: r.message,
                                    originalError: r
                                })
                            }
                        }
                    }
                }, {
                    key: "abort",
                    value: function() {
                        this.videoBuffer_ && this.videoBuffer_.abort(), !this.audioDisabled_ && this.audioBuffer_ && this.audioBuffer_.abort(), this.transmuxer_ && this.transmuxer_.postMessage({
                            action: "reset"
                        }), this.pendingBuffers_.length = 0, this.bufferUpdating_ = !1
                    }
                }]), t
            }(d["default"].EventTarget);
            i["default"] = O
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}],
    76: [function(e, t, i) {
        var n = arguments[3],
            r = arguments[4],
            a = arguments[5],
            s = JSON.stringify,
            o = !1,
            u = function(e) {
                function t(n) {
                    if (i[n]) return i[n].exports;
                    var r = i[n] = {
                        i: n,
                        l: !1,
                        exports: {}
                    };
                    return e[n].call(r.exports, r, r.exports, t), r.l = !0, r.exports
                }
                var i = {};
                return t.m = e, t.c = i, t.d = function(e, i, n) {
                    t.o(e, i) || Object.defineProperty(e, i, {
                        configurable: !1,
                        enumerable: !0,
                        get: n
                    })
                }, t.n = function(e) {
                    var i = e && e.__esModule ? function() {
                        return e["default"]
                    } : function() {
                        return e
                    };
                    return t.d(i, "a", i), i
                }, t.o = function(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t)
                }, t.p = "", t(t.s = entryModule)
            };
        void 0 === n && (o = !0, n = u, r = __webpack_modules__);
        var d = function(e) {
            for (var t, i = Object.keys(a), o = 0; o < i.length; o++) {
                var u = i[o],
                    d = a[u].exports;
                if (d === e || d && d["default"] === e) {
                    t = u;
                    break
                }
            }
            if (!t) {
                t = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                for (var l = {}, o = 0; o < i.length; o++) {
                    var u = i[o];
                    l[u] = u
                }
                r[t] = ["function(require,module,exports){" + e + "(self); }", l]
            }
            var f = Math.floor(Math.pow(16, 8) * Math.random()).toString(16),
                c = {};
            return c[t] = t, r[f] = ["function(require,module,exports){var f = require(" + s(t) + ");(f.default ? f.default : f)(self);}", c], "(" + n + ")({" + Object.keys(r).map(function(e) {
                return s(e) + ":[" + r[e][0] + "," + s(r[e][1]) + "]"
            }).join(",") + "},{},[" + s(f) + "])"
        }, l = function(e, t) {
            var i, a = "string" == typeof t;
            i = a ? {} : [], Object.keys(r).forEach(function(e) {
                r[e] && (i[e] = r[e].toString())
            });
            var o = __webpack_require__(t);
            if (!o || o !== e && o["default"] !== e) {
                var u = i[t];
                i[t] = u.substring(0, u.length - 1) + "\n" + e.name + "();\n}"
            }
            var d;
            if (a) {
                t = s(t);
                d = "{" + Object.keys(i).map(function(e) {
                    return s(e) + ":" + i[e]
                }).join(",") + "}"
            } else d = "[" + i.join(",") + "]";
            return "var fn = (" + n.toString().replace("entryModule", t) + ")(" + d + ');\n(typeof fn === "function") && fn(self);'
        };
        t.exports = function(e, t) {
            var i;
            i = o ? l(e, t) : d(e);
            var n = new Blob([i], {
                    type: "text/javascript"
                }),
                r = window.URL || window.webkitURL || window.mozURL || window.msURL,
                a = r.createObjectURL(n),
                s = new Worker(a);
            return s.objectURL = a, s
        }
    }, {}],
    77: [function(e, t, i) {
        (function(i) {
            "use strict";

            function n(e) {
                return e && e.__esModule ? e : {
                    "default": e
                }
            }
            function r(e, t) {
                if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function")
            }
            function a(e, t) {
                if ("function" != typeof t && null !== t) throw new TypeError("Super expression must either be null or a function, not " + typeof t);
                e.prototype = Object.create(t && t.prototype, {
                    constructor: {
                        value: e,
                        enumerable: !1,
                        writable: !0,
                        configurable: !0
                    }
                }), t && (Object.setPrototypeOf ? Object.setPrototypeOf(e, t) : e.__proto__ = t)
            }
            var s = function() {
                    function e(e, t) {
                        for (var i = 0; i < t.length; i++) {
                            var n = t[i];
                            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(e, n.key, n)
                        }
                    }
                    return function(t, i, n) {
                        return i && e(t.prototype, i), n && e(t, n), t
                    }
                }(),
                o = function(e, t, i) {
                    for (var n = !0; n;) {
                        var r = e,
                            a = t,
                            s = i;
                        n = !1, null === r && (r = Function.prototype);
                        var o = Object.getOwnPropertyDescriptor(r, a);
                        if (o !== undefined) {
                            if ("value" in o) return o.value;
                            var u = o.get;
                            return u === undefined ? undefined : u.call(s)
                        }
                        var d = Object.getPrototypeOf(r);
                        if (null === d) return undefined;
                        e = d, t = a, i = s, n = !0, o = d = undefined
                    }
                }, u = e(31),
                d = n(u),
                l = e(9),
                f = n(l),
                c = e(11),
                h = n(c),
                p = e(21),
                m = n(p),
                g = e(25),
                y = e(2),
                _ = n(y),
                v = e(74),
                b = e(33),
                T = n(b),
                S = "undefined" != typeof window ? window.videojs : void 0 !== i ? i.videojs : null,
                w = n(S),
                k = e(5),
                O = e(3),
                E = n(O),
                A = e(14),
                L = n(A),
                P = e(32),
                I = n(P),
                C = e(8),
                U = n(C),
                D = e(13),
                M = n(D),
                R = e(10),
                x = {
                    PlaylistLoader: f["default"],
                    Playlist: h["default"],
                    Decrypter: g.Decrypter,
                    AsyncStream: g.AsyncStream,
                    decrypt: g.decrypt,
                    utils: _["default"],
                    STANDARD_PLAYLIST_SELECTOR: R.lastBandwidthSelector,
                    INITIAL_PLAYLIST_SELECTOR: R.lowestBitrateCompatibleVariantSelector,
                    comparePlaylistBandwidth: R.comparePlaylistBandwidth,
                    comparePlaylistResolution: R.comparePlaylistResolution,
                    xhr: (0, m["default"])()
                };
            ["GOAL_BUFFER_LENGTH", "MAX_GOAL_BUFFER_LENGTH", "GOAL_BUFFER_LENGTH_RATE", "BUFFER_LOW_WATER_LINE", "MAX_BUFFER_LOW_WATER_LINE", "BUFFER_LOW_WATER_LINE_RATE", "BANDWIDTH_VARIANCE"].forEach(function(e) {
                Object.defineProperty(x, e, {
                    get: function() {
                        return w["default"].log.warn("using Hls." + e + " is UNSAFE be sure you know what you are doing"), E["default"][e]
                    },
                    set: function(t) {
                        if (w["default"].log.warn("using Hls." + e + " is UNSAFE be sure you know what you are doing"), "number" != typeof t || t < 0) return void w["default"].log.warn("value of Hls." + e + " must be greater than or equal to 0");
                        E["default"][e] = t
                    }
                })
            });
            var B = function(e, t) {
                for (var i = t.media(), n = -1, r = 0; r < e.length; r++) if (e[r].id === i.uri) {
                    n = r;
                    break
                }
                e.selectedIndex_ = n, e.trigger({
                    selectedIndex: n,
                    type: "change"
                })
            }, j = function(e, t) {
                t.representations().forEach(function(t) {
                    e.addQualityLevel(t)
                }), B(e, t.playlists)
            };
            x.canPlaySource = function() {
                return w["default"].log.warn("HLS is no longer a tech. Please remove it from your player's techOrder.")
            }, x.supportsNativeHls = function() {
                var e = d["default"].createElement("video");
                return !!w["default"].getTech("Html5").isSupported() && ["application/vnd.apple.mpegurl", "audio/mpegurl", "audio/x-mpegurl", "application/x-mpegurl", "video/x-mpegurl", "video/mpegurl", "application/mpegurl"].some(function(t) {
                    return /maybe|probably/i.test(e.canPlayType(t))
                })
            }(), x.isSupported = function() {
                return w["default"].log.warn("HLS is no longer a tech. Please remove it from your player's techOrder.")
            };
            var N = w["default"].getComponent("Component"),
                F = function(e) {
                    function t(e, i, n) {
                        var a = this;
                        if (r(this, t), o(Object.getPrototypeOf(t.prototype), "constructor", this).call(this, i, n.hls), i.options_ && i.options_.playerId) {
                            var s = (0, w["default"])(i.options_.playerId);
                            s.hasOwnProperty("hls") || Object.defineProperty(s, "hls", {
                                get: function() {
                                    return w["default"].log.warn("player.hls is deprecated. Use player.tech_.hls instead."), i.trigger({
                                        type: "usage",
                                        name: "hls-player-access"
                                    }), a
                                }
                            })
                        }
                        if (this.tech_ = i, this.source_ = e, this.stats = {}, this.ignoreNextSeekingEvent_ = !1, this.setOptions_(), this.options_.overrideNative && (i.featuresNativeVideoTracks || i.featuresNativeAudioTracks)) throw new Error("Overriding native HLS requires emulated tracks. See https://git.io/vMpjB");
                        this.on(d["default"], ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"], function(e) {
                            var t = d["default"].fullscreenElement || d["default"].webkitFullscreenElement || d["default"].mozFullScreenElement || d["default"].msFullscreenElement;
                            t && t.contains(a.tech_.el()) && a.masterPlaylistController_.fastQualityChange_()
                        }), this.on(this.tech_, "seeking", function() {
                            if (this.ignoreNextSeekingEvent_) return void(this.ignoreNextSeekingEvent_ = !1);
                            this.setCurrentTime(this.tech_.currentTime())
                        }), this.on(this.tech_, "error", function() {
                            this.masterPlaylistController_ && this.masterPlaylistController_.pauseLoading()
                        }), this.on(this.tech_, "play", this.play)
                    }
                    return a(t, e), s(t, [{
                        key: "setOptions_",
                        value: function() {
                            var e = this;
                            this.options_.withCredentials = this.options_.withCredentials || !1, "number" != typeof this.options_.blacklistDuration && (this.options_.blacklistDuration = 300), "number" != typeof this.options_.bandwidth && (this.options_.bandwidth = 4194304), this.options_.enableLowInitialPlaylist = this.options_.enableLowInitialPlaylist && 4194304 === this.options_.bandwidth, ["withCredentials", "bandwidth"].forEach(function(t) {
                                "undefined" != typeof e.source_[t] && (e.options_[t] = e.source_[t])
                            }), this.bandwidth = this.options_.bandwidth
                        }
                    }, {
                        key: "src",
                        value: function(e) {
                            var t = this;
                            e && (this.setOptions_(), this.options_.url = this.source_.src, this.options_.tech = this.tech_, this.options_.externHls = x, this.masterPlaylistController_ = new k.MasterPlaylistController(this.options_), this.playbackWatcher_ = new U["default"](w["default"].mergeOptions(this.options_, {
                                seekable: function() {
                                    return t.seekable()
                                }
                            })), this.masterPlaylistController_.on("error", function() {
                                w["default"].players[t.tech_.options_.playerId].error(t.masterPlaylistController_.error)
                            }), this.masterPlaylistController_.selectPlaylist = this.selectPlaylist ? this.selectPlaylist.bind(this) : x.STANDARD_PLAYLIST_SELECTOR.bind(this), this.masterPlaylistController_.selectInitialPlaylist = x.INITIAL_PLAYLIST_SELECTOR.bind(this), this.playlists = this.masterPlaylistController_.masterPlaylistLoader_, this.mediaSource = this.masterPlaylistController_.mediaSource, Object.defineProperties(this, {
                                selectPlaylist: {
                                    get: function() {
                                        return this.masterPlaylistController_.selectPlaylist
                                    },
                                    set: function(e) {
                                        this.masterPlaylistController_.selectPlaylist = e.bind(this)
                                    }
                                },
                                throughput: {
                                    get: function() {
                                        return this.masterPlaylistController_.mainSegmentLoader_.throughput.rate
                                    },
                                    set: function(e) {
                                        this.masterPlaylistController_.mainSegmentLoader_.throughput.rate = e, this.masterPlaylistController_.mainSegmentLoader_.throughput.count = 1
                                    }
                                },
                                bandwidth: {
                                    get: function() {
                                        return this.masterPlaylistController_.mainSegmentLoader_.bandwidth
                                    },
                                    set: function(e) {
                                        this.masterPlaylistController_.mainSegmentLoader_.bandwidth = e, this.masterPlaylistController_.mainSegmentLoader_.throughput = {
                                            rate: 0,
                                            count: 0
                                        }
                                    }
                                },
                                systemBandwidth: {
                                    get: function() {
                                        var e = 1 / (this.bandwidth || 1),
                                            t = undefined;
                                        return t = this.throughput > 0 ? 1 / this.throughput : 0, Math.floor(1 / (e + t))
                                    },
                                    set: function() {
                                        w["default"].log.error('The "systemBandwidth" property is read-only')
                                    }
                                }
                            }), Object.defineProperties(this.stats, {
                                bandwidth: {
                                    get: function() {
                                        return t.bandwidth || 0
                                    },
                                    enumerable: !0
                                },
                                mediaRequests: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaRequests_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaRequestsAborted: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaRequestsAborted_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaRequestsTimedout: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaRequestsTimedout_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaRequestsErrored: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaRequestsErrored_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaTransferDuration: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaTransferDuration_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaBytesTransferred: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaBytesTransferred_() || 0
                                    },
                                    enumerable: !0
                                },
                                mediaSecondsLoaded: {
                                    get: function() {
                                        return t.masterPlaylistController_.mediaSecondsLoaded_() || 0
                                    },
                                    enumerable: !0
                                }
                            }), this.tech_.one("canplay", this.masterPlaylistController_.setupFirstPlay.bind(this.masterPlaylistController_)), this.masterPlaylistController_.on("selectedinitialmedia", function() {
                                (0, L["default"])(t)
                            }), this.on(this.masterPlaylistController_, "progress", function() {
                                this.tech_.trigger("progress")
                            }), this.on(this.masterPlaylistController_, "firstplay", function() {
                                this.ignoreNextSeekingEvent_ = !0
                            }), this.tech_.ready(function() {
                                return t.setupQualityLevels_()
                            }), this.tech_.el() && this.tech_.src(w["default"].URL.createObjectURL(this.masterPlaylistController_.mediaSource)))
                        }
                    }, {
                        key: "setupQualityLevels_",
                        value: function() {
                            var e = this,
                                t = w["default"].players[this.tech_.options_.playerId];
                            t && t.qualityLevels && (this.qualityLevels_ = t.qualityLevels(), this.masterPlaylistController_.on("selectedinitialmedia", function() {
                                j(e.qualityLevels_, e)
                            }), this.playlists.on("mediachange", function() {
                                B(e.qualityLevels_, e.playlists)
                            }))
                        }
                    }, {
                        key: "play",
                        value: function() {
                            this.masterPlaylistController_.play()
                        }
                    }, {
                        key: "setCurrentTime",
                        value: function(e) {
                            this.masterPlaylistController_.setCurrentTime(e)
                        }
                    }, {
                        key: "duration",
                        value: function() {
                            return this.masterPlaylistController_.duration()
                        }
                    }, {
                        key: "seekable",
                        value: function() {
                            return this.masterPlaylistController_.seekable()
                        }
                    }, {
                        key: "dispose",
                        value: function() {
                            this.playbackWatcher_ && this.playbackWatcher_.dispose(), this.masterPlaylistController_ && this.masterPlaylistController_.dispose(), this.qualityLevels_ && this.qualityLevels_.dispose(), o(Object.getPrototypeOf(t.prototype), "dispose", this).call(this)
                        }
                    }]), t
                }(N),
                q = function H(e) {
                    return {
                        canHandleSource: function(t) {
                            var i = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1],
                                n = w["default"].mergeOptions(w["default"].options, i);
                            return (!n.hls || !n.hls.mode || n.hls.mode === e) && H.canPlayType(t.type, n)
                        },
                        handleSource: function(t, i) {
                            var n = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2],
                                r = w["default"].mergeOptions(w["default"].options, n, {
                                    hls: {
                                        mode: e
                                    }
                                });
                            return "flash" === e && i.setTimeout(function() {
                                i.trigger("loadstart")
                            }, 1), i.hls = new F(t, i, r), i.hls.xhr = (0, m["default"])(), i.hls.src(t.src), i.hls
                        },
                        canPlayType: function(e) {
                            var t = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1],
                                i = w["default"].mergeOptions(w["default"].options, t);
                            return H.canPlayType(e, i) ? "maybe" : ""
                        }
                    }
                };
            q.canPlayType = function(e, t) {
                if (w["default"].browser.IE_VERSION && w["default"].browser.IE_VERSION <= 10) return !1;
                var i = /^(audio|video|application)\/(x-|vnd\.apple\.)?mpegurl/i;
                return !(!t.hls.overrideNative && x.supportsNativeHls) && i.test(e)
            }, "undefined" != typeof w["default"].MediaSource && "undefined" != typeof w["default"].URL || (w["default"].MediaSource = v.MediaSource, w["default"].URL = v.URL);
            var G = w["default"].getTech("Flash");
            v.MediaSource.supportsNativeMediaSources() && w["default"].getTech("Html5").registerSourceHandler(q("html5"), 0), I["default"].Uint8Array && G && G.registerSourceHandler(q("flash")), w["default"].HlsHandler = F, w["default"].HlsSourceHandler = q, w["default"].Hls = x, w["default"].use || w["default"].registerComponent("Hls", x), w["default"].m3u8 = T["default"], w["default"].options.hls = w["default"].options.hls || {}, w["default"].registerPlugin ? w["default"].registerPlugin("reloadSourceOnError", M["default"]) : w["default"].plugin("reloadSourceOnError", M["default"]), t.exports = {
                Hls: x,
                HlsHandler: F,
                HlsSourceHandler: q
            }
        }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {}]
}, {}, [77]);