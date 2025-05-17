var CRAWLER_MODE = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent);

if (typeof gtag === 'undefined' && typeof ga == 'function') {
	gtag = function () {
		try {
			const id = arguments[0];
			if (id === 'event' && arguments.length >= 2) {
				const action = arguments[1];
				const opts = arguments[2];
				
				// https://developers.google.com/analytics/devguides/collection/analyticsjs/events
				// ga('send', 'event', [eventCategory], [eventAction], [eventLabel], [eventValue], [fieldsObject]);
				ga('send', 'event', opts.event_category, action, opts.event_label, opts.value | 0, {
					nonInteraction: !!opts.non_interaction ? 1 : 0
				});
			}
			
		} catch (e) {
			console.error(e);
		}
	}
	
} else {
	if (!CRAWLER_MODE)
		alert('Nor gtag or ga function are defined!');
}

try {
	eval("const foo = true; let bar = false; () => {};");
}
catch (err) {
	gtag('event', 'site', {
		'event_category': 'compatibility',
		'event_label': 'ES6_missing',
		'value': 1,
		'non_interaction': true
	});
	
	if (!CRAWLER_MODE)
		alert("Please update your browser! The game may not work");
}

if (typeof GAME_ID !== 'string')
    console.error('GAME_ID is not defined');
if (typeof REVISION === 'undefined')
    REVISION = null;

// https://support.cloudflare.com/hc/en-us/articles/200172516-Which-file-extensions-does-Cloudflare-cache-for-static-content-
if (typeof LOBBY_FILE_EXT === 'undefined')
    LOBBY_FILE_EXT = 'png';
if (typeof PACKAGE_FILE_EXT === 'undefined')
    PACKAGE_FILE_EXT = 'png';
if (typeof WASM_FILE_EXT === 'undefined')
    WASM_FILE_EXT = 'class'; // be sure your backend web server treat .class as application/wasm MIME type

if (typeof FILESYSTEM_FILE_EXT === 'undefined')
    FILESYSTEM_FILE_EXT = 'json';
if (typeof PACKAGES_PATH === 'undefined')
    PACKAGES_PATH = 'data/';
if (typeof CDN_PREFIX === 'undefined')
    CDN_PREFIX = '';

const ENABLE_FUNNEL = false;
const PWA_MODE = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || !!(navigator && navigator.standalone);
const MOBILE_DEVICE = /iphone|ipad|ipod|android|iemobile|tablet|phone|mobile|webos|blackberry|opera mini|playbook|silk|kindle|opera mobi/i.test(navigator.userAgent) || (/macintosh/i.test(navigator.userAgent) && (!!navigator.maxTouchPoints || 'ontouchstart' in document.documentElement)) || typeof window.orientation !== "undefined";

function LoadScript(e,t) {var n,a=document.createElement("script");a.setAttribute("src",e),a.onreadystatechange=a.onload=function(){n||(n=!0,t&&t())},document.getElementsByTagName("head")[0].appendChild(a)}
function trace() {if(void 0!=window.console&&"function"==typeof window.console.log){var o=Array.prototype.slice.call(arguments,0);try{window.console.log.apply(window.console,o)}catch(n){}}}							

if (typeof USE_SENTRY !== 'undefined' && !!USE_SENTRY) {
	LoadScript('https://browser.sentry-cdn.com/5.9.1/bundle.min.js', function () {
		Sentry.init({
			dsn: 'https://a8f0d9c1a2074ebeaeb8e93e680080ff@sentry.io/1838424',
			attachStacktrace: true,
			onunhandledrejection: false,
			onerror: false
		});
		
		JS_OnException = function (e) {
			Sentry.captureException(e);			
		};
	});
}

window.addEventListener('error', function(event) {
	if (event.message === 'Script error.') // https://dzone.com/articles/what-the-heck-is-script-error
		return;
	
	if (typeof __error_registered !== 'undefined')
		return;
	
	let desc = event.filename + " (" + event.lineno + "): " + event.message + "; " + JSON.stringify(event.error).substring(0, 80);		
	gtag('event', 'except', {
		'event_category': 'error',
		'event_label': desc,
		'non_interaction': true
	});
	
	console.error("exception logged...", desc);
	//trace(event.error.stack);
	
	__error_registered = true;
});

var QUERY_PARAMS = new Object(); // NOTE: do not make it const!
(function () {
	var e,
		a = /\+/g,
		r = /([^&=]+)=?([^&]*)/g,
		d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
		q = window.location.search.substring(1);
	while (e = r.exec(q))
		QUERY_PARAMS[d(e[1])] = d(e[2]);
})();

(function(){'use strict';var module={options:[],header:[navigator.platform,navigator.userAgent,navigator.appVersion,navigator.vendor,window.opera],dataos:[{name:'Windows Phone',value:'Windows Phone',version:'OS'},{name:'Windows',value:'Win',version:'NT'},{name:'iPhone',value:'iPhone',version:'OS'},{name:'iPad',value:'iPad',version:'OS'},{name:'Kindle',value:'Silk',version:'Silk'},{name:'Android',value:'Android',version:'Android'},{name:'PlayBook',value:'PlayBook',version:'OS'},{name:'BlackBerry',value:'BlackBerry',version:'/'},{name:'Macintosh',value:'Mac',version:'OS X'},{name:'Linux',value:'Linux',version:'rv'},{name:'Palm',value:'Palm',version:'PalmOS'}],databrowser:[{name:'Chrome',value:'Chrome',version:'Chrome'},{name:'Firefox',value:'Firefox',version:'Firefox'},{name:'Safari',value:'Safari',version:'Version'},{name:'Internet Explorer',value:'MSIE',version:'MSIE'},{name:'Opera',value:'Opera',version:'Opera'},{name:'BlackBerry',value:'CLDC',version:'CLDC'},{name:'Mozilla',value:'Mozilla',version:'Mozilla'}],init:function(){var agent=this.header.join(' '),os=this.matchItem(agent,this.dataos),browser=this.matchItem(agent,this.databrowser);window.os=os;window.browser=browser;},matchItem:function(string,data){var i=0,j=0,html='',regex,regexv,match,matches,version;for(i=0;i<data.length;i+=1){regex=new RegExp(data[i].value,'i');match=regex.test(string);if(match){regexv=new RegExp(data[i].version+'[- /:;]([\\d._]+)','i');matches=string.match(regexv);version='';if(matches){if(matches[1]){matches=matches[1];}}
if(matches){matches=matches.split(/[._]+/);for(j=0;j<matches.length;j+=1){if(j===0){version+=matches[j]+'.';}else{version+=matches[j];}}}else{version='0';}
return{name:data[i].name,version:parseFloat(version)};}}
return{name:'unknown',version:0};}};module.init();}());

function ListenTabFocus(onBlurCallback,onFocusCallback){var hidden,visibilityState,visibilityChange;if(typeof document.hidden!=="undefined"){hidden="hidden";visibilityChange="visibilitychange";visibilityState="visibilityState";}else if(typeof document.mozHidden!=="undefined"){hidden="mozHidden";visibilityChange="mozvisibilitychange";visibilityState="mozVisibilityState";}else if(typeof document.msHidden!=="undefined"){hidden="msHidden";visibilityChange="msvisibilitychange";visibilityState="msVisibilityState";}else if(typeof document.webkitHidden!=="undefined"){hidden="webkitHidden";visibilityChange="webkitvisibilitychange";visibilityState="webkitVisibilityState";}
if(typeof document.addEventListener==="undefined"||typeof hidden==="undefined"){}else{document.addEventListener(visibilityChange,function(){switch(document[visibilityState]){case"visible":if(onFocusCallback)onFocusCallback();break;case"hidden":if(onBlurCallback)onBlurCallback();break;}},false);}}

var __time_measure = (function (self) {
	let start_time;
	self.start = function () {start_time = new Date();};
	self.finish = function () {return ((new Date()) - start_time) * 0.001;};
	return self;
})({});

if (browser.name === "Internet Explorer") {
	if (!CRAWLER_MODE)
		alert('Warning: Internet Explorer is not supported. Please use any modern browser to play this game.');
}

const DEV_VERSION = QUERY_PARAMS.dev === '1';

const BROWSER_LANG = (navigator.languages && navigator.languages[0] || navigator.language || navigator.userLanguage).split('-')[0].toLowerCase();
const EXACT_LANG = QUERY_PARAMS.locale || BROWSER_LANG;

const NOCACHE = '?nocache' + ((new Date).getTime() % 99999);

const FS_BASEPATH = "thug";

const gamemodule_path = CDN_PREFIX;

// NOTE: keep in mind that service worker does not respect cache control
const gamemodule_file = DEV_VERSION ? '/embed/farm_dev/index.js' + NOCACHE : (!REVISION ? "index.js" : "index_r" + REVISION.module + ".js");
const lobby_file = DEV_VERSION ? String.fromCharCode(108, 111, 98, 98, 121, 46, 115, 119, 102) + NOCACHE : (REVISION ? "lobby_r" + REVISION.lobby + "." + LOBBY_FILE_EXT : "lobby." + LOBBY_FILE_EXT);
const paks_path = CDN_PREFIX + PACKAGES_PATH;
const paks_filesystem_file = "filesystem." + FILESYSTEM_FILE_EXT + (REVISION ? '?r=' + REVISION.filesystem : (DEV_VERSION ? NOCACHE : ''));
if (DEV_VERSION)
	console.warn("Attention. Using developer version:", gamemodule_file, lobby_file);

// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
// chrome.exe --disable-features=AutoplayIgnoreWebAudio
// https://gist.github.com/surma/301c9c377aaf90a3fdae615d4840bb2e 
var audiocontext_list = [];
var acontext = window.AudioContext || window.webkitAudioContext;
if (acontext) {
	try {
		var acproxy = new Proxy(acontext, {
			construct(target, args) {
				var result = new target(...args);
				audiocontext_list.push(result);
				trace('AudioContext created with state: ', result.state);
				return result;
			}
		});	
		if (window.AudioContext)
			window.AudioContext = acproxy;
		else if (window.webkitAudioContext) // iOS Safari
			window.webkitAudioContext = acproxy;
	} catch (err) {
		console.error(err);
	}
}

function JS_MuteAudio() {
	audiocontext_list.forEach(function (ctx) {
        if (ctx.state == 'running') {
            ctx.suspend().then(() => {
                if (DEV_VERSION)
					trace('muting audio context, new state:', ctx.state);						    
            });            
        }
    });
}

function JS_UnMuteAudio() {
	audiocontext_list.forEach(function (ctx) {
        if (ctx.state != 'running') {
            ctx.resume().then(() => {
				if (DEV_VERSION)
					trace('unmuting audio context, new state:', ctx.state);						
            });
        }
    });
}

ListenTabFocus(function () {
	trace('muting audio context on blur:');
    JS_MuteAudio();
    
}, function () {
	trace('unmuting audio context on focus:');						
	JS_UnMuteAudio();    
});

function LogError(msg) {
	gtag('event', 'except', {
        'event_category': 'com_error',
        'event_label': msg,
        'non_interaction': true
    });
    
    console.error("error logged...", msg);
}

// onload(ArrayBuffer), onprogress([0-1.0])
function FetchArrayBuffer(url, onload, onprogress) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "arraybuffer";
	req.onload = function(event) {
		var arrayBuffer = req.response;
		onload(arrayBuffer);
	};
    if (typeof onprogress == 'function')
        req.onprogress = function (event) {
            if (event.lengthComputable)
                onprogress(event.loaded / event.total);
        };
	req.send();
}

// onload(parsed_json_object), onprogress([0-1.0])
function FetchJSONObject(url, onload, onprogress) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "json";
	req.onload = function (event) {
		onload(req.response);
	};
    if (typeof onprogress == 'function')
        req.onprogress = function (event) {
            if (event.lengthComputable)
                onprogress(event.loaded / event.total);
        };
	req.send();
}

function FetchTextObject(url, onload) {
	var req = new XMLHttpRequest();
	req.open("GET", url, true);
	req.responseType = "text";
	req.onload = function (event) {
		onload(req.response);
	};
	req.send();
}

function FetchHeaders(url, onload) {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);    
    req.onreadystatechange = function() {
        if (this.readyState == this.HEADERS_RECEIVED) {
            //req.getResponseHeader("X-Payload");
            onload(req);
            req.abort();
        }
    };
    req.send();
}

trace(os.name, os.version, browser.name, browser.version, gamemodule_path, PWA_MODE ? 'pwa mode' : '');

var GameModule;
var GAMEMODULE_FILESYSTEM;
var GAMEMODULE_CONFIG;

function UpdateProgressBar(progress) {
    $(".meter > span").each(function() {
        $(this).width('' + 100 * progress + '%');
    });
}

function AnimateProgressBar(progress, target_progress, duration_ms) {
    $(".meter > span").each(function() {
        $(this)
            .width('' + 100 * progress + '%')
            .animate({ width: '' + 100 * target_progress + '%' }, duration_ms)
            ;
    });
}

const __funnel_base_time = new Date().getTime();
function BootstrapFunnelStage(id) {
	if (ENABLE_FUNNEL) {
		var time_delta = (new Date().getTime() - __funnel_base_time) / 1000;
		gtag('event', id, {
			'event_category': 'funnel',
			'value': time_delta | 0,
			'non_interaction': true
		});
	}
}

// NOTE: 2.0 if transformed by @media
function CanvasDotsPerPixel() {
    var element = document.getElementById('canvas');
    return element.offsetWidth / element.getBoundingClientRect().width;
}

function ReplaceFileExtension(filename, new_ext) {
    var parts = filename.split('.');
    parts.pop();
    parts.push(new_ext);
    return parts.join('.');
}

function DownloadAndStoreAssets(on_complete) {
	var paks = GAMEMODULE_FILESYSTEM.preload_paks.concat();	
	var map_filename = GAMEMODULE_FILESYSTEM.map_paks[GAME_ID];
	paks.push(map_filename);
	
	var paks_remain = paks.length;
	
	function WaitHeapInitialized(callback) { // NOTE: heap can be uninitialized at this moment on slow devices (air2)
		if (HEAP8) {
			callback();
			return;
		}
		var wait_id = setInterval(function () {		
			if (HEAP8) {
				clearInterval(wait_id);
				callback();
				return;
			}
		}, 10);
	}
	
	function load_pak(filename) {
		var pak_url = paks_path + ReplaceFileExtension(filename, PACKAGE_FILE_EXT);
		
		FetchArrayBuffer(pak_url, function (arraybuffer) {
			trace("storing", filename, "to file system");
			WaitHeapInitialized(function () {
				FS.createPreloadedFile("/" + FS_BASEPATH, ReplaceFileExtension(filename, 'png'), new Uint8Array(arraybuffer), true, false); // REF: library_fs.js: createPreloadedFile
				// NOTE: MEMFS doesnt require FS.syncfs			
				if (--paks_remain == 0)
					on_complete();
			});
		});
	}
		
	for (var i in paks)		
		load_pak(paks[i]);
}

function CreateGameModule() {
	var lobby_file_data;
	
	trace("loading lobby...");            
	FetchArrayBuffer(gamemodule_path + lobby_file, function (lobby_file) {
		trace('lobby loaded');
		lobby_file_data = new Uint8Array(lobby_file);
		BootstrapFunnelStage('LobbyLoaded');
		
	}, function (progress) {
		UpdateProgressBar(0.25 + progress * 0.15);
		
		if (progress == 1)
			AnimateProgressBar(0.4, 1.0, 15000);
	});
	
	return {
        noImageDecoding: true,
        
        postRun: [],
		
        onAbort: function (what) {
            if (DEV_VERSION) {
                trace('abort', what);
                debugger;
            }
        },
        
		locateFile: function (filename, script_dir) {
            trace('locateFile:', filename, script_dir);
            
            var filename_parts = filename.split('.');
            var ext = filename_parts.pop();            
            if (ext === "wasm") {
                var name = filename_parts.shift();
                
				if (DEV_VERSION)
					return '/embed/farm_dev/' + filename + NOCACHE;
                else if (REVISION)
                    return gamemodule_path + name + "_r" + REVISION.module + "." + WASM_FILE_EXT;
                else
                    return gamemodule_path + ReplaceFileExtension(filename, WASM_FILE_EXT);
            }
            else
                return gamemodule_path + filename;
		},
		
		preInit: function () {
			trace('GameModule.preInit');
			
			GameModule.arguments = [];
			GameModule.viewport = document.getElementById("viewport");
			
            UpdateProgressBar(0.24);
			
			GameModule.addOnPreMain(function () {
				trace('GameModule.addOnPreMain');
				
				var canvas = document.getElementById("canvas");
				
				$('#canvas').on('click touchstart', function () {
					window.focus();
					canvas.focus();
					
                    audiocontext_list.forEach(function (ctx) {
                        if (ctx.state != 'running') {
                            ctx.resume().then(() => {
                                trace('resuming audio context on click, new state:', ctx.state);						
                            });
                        }
                    });
				});
												
				GameModule['canvas'] = canvas;
                
				GameModule.postRun.push(function () {				
					trace('GameModule.postRun');
					
					canvas.focus();
                    
                    trace("data packages loading");
                    DownloadAndStoreAssets(function () {
                        trace("all data packages downloaded");
                        GameModule.all_resources_downloaded = true;
                        BootstrapFunnelStage('PackagesLoaded');
                    });
				});
			});
		},
		
		preRun: function () { // NOTE: was preInit before library_memfs introduced HEAP8 reference which is undefined at preInit obviously
			trace('GameModule.preRun');
			
			FS.mkdir(FS_BASEPATH, 511); // FIXME: octal 0777 is not supported in strict mode
			
			GameModule.addRunDependency('waiting for lobby_file_data');
            var lobby_file_waiting = setInterval(function () {
                if (lobby_file_data) {
                    clearInterval(lobby_file_waiting);
					GameModule['FS_createPreloadedFile']("/", "lobby.png", lobby_file_data, true, false); // REF: library_fs.js: createPreloadedFile
                    GameModule.removeRunDependency('waiting for lobby_file_data');
                }
            }, 100);
			
            GameModule.addRunDependency('waiting for GAMEMODULE_FILESYSTEM');
            var GAMEMODULE_FILESYSTEM_waiting = setInterval(function () {
                if (GAMEMODULE_FILESYSTEM) {
                    clearInterval(GAMEMODULE_FILESYSTEM_waiting);                        
                    GameModule.removeRunDependency('waiting for GAMEMODULE_FILESYSTEM');
                    trace('GAMEMODULE_FILESYSTEM waiting finished');
                }
            }, 100);
            
            GameModule.addRunDependency('waiting for GAMEMODULE_CONFIG');
            var GAMEMODULE_CONFIG_waiting = setInterval(function () {
                if (GAMEMODULE_CONFIG) {
                    clearInterval(GAMEMODULE_CONFIG_waiting);                        
                    GameModule.removeRunDependency('waiting for GAMEMODULE_CONFIG');
                    trace('GAMEMODULE_CONFIG waiting finished');
                }
            }, 100);
		}		
	};
}

function JS_OnGameplayStarted() {
    trace('JS_OnGameplayStarted');
    
    try { if (typeof parent.JS_OnLobbyShown === 'function') parent.JS_OnLobbyShown(); } catch (e) {}
    
    setTimeout(function () {
        $("#preloader").remove();
    }, 180);
    
    gtag('event', 'game', {
      'event_category': 'gameplay',
      'event_label': 'started',
      'value': 1
    });
    
    BootstrapFunnelStage('LobbyStarted');
    
    try { if (typeof JS_AfterGameplayStarted === 'function') JS_AfterGameplayStarted(); } catch (e) {}; // NOTE: defined somewhere else
}

function wasmAvailable() {
	try {
		var bin = new Uint8Array([0,97,115,109,1,0,0,0,1,6,1,96,1,127,1,127,3,2,1,0,5,3,1,0,1,7,8,1,4,116,101,115,116,0,0,10,16,1,14,0,32,0,65,1,54,2,0,32,0,40,2,0,11]);
		var mod = new WebAssembly.Module(bin);
		var inst = new WebAssembly.Instance(mod, {});

		// test storing to and loading from a non-zero location via a parameter.
		// Safari on iOS 11.2.5 returns 0 unexpectedly at non-zero locations
		return (inst.exports.test(4) !== 0);
		
	} catch (e) {
		return false;
	}
}

var config_url = 'https://clash3d.com/config/' + GAME_ID + '.required';
if (DEV_VERSION)
    config_url += '?dev=1';
var network_config_waiting_timer = setTimeout(function () {
    trace("network config was not loaded, using stub");
    GAMEMODULE_CONFIG = {};
    
    gtag('event', 'site', {
        'event_category': 'config',
        'event_label': 'fetch_failed',
        'value': 1,
        'non_interaction': true
    });
}, 2500);

FetchJSONObject(config_url, function (obj) {
    trace("network config loaded");
    GAMEMODULE_CONFIG = obj;
    clearTimeout(network_config_waiting_timer);
    BootstrapFunnelStage('ConfigLoaded');
});

FetchJSONObject(paks_path + paks_filesystem_file, function (filesystem) {
    trace("game module file system loaded");
    GAMEMODULE_FILESYSTEM = filesystem;
    BootstrapFunnelStage('FilesystemLoaded');

}, function (progress) {
    UpdateProgressBar(0.05 + 0.05 * progress);
});

function DetectAdblock(on_result) {	
	function quick_DOM_check() {
		var test = document.createElement('div');
		test.innerHTML = '&nbsp;';
		test.className = 'ad_container';
		test.style.position = 'absolute';
		test.style.fontSize = '10px';
		document.body.appendChild(test);

		setTimeout(function () {
			if (test.offsetHeight !== 0 && window.getComputedStyle(test, null).display === 'block') {
				// NOTE: helpful if network is unreachable (airplane mode), but no adblocker is really installed
				console.debug('DetectAdblock: good news, DOM check discovered no AdBlock presence!');
				on_result && on_result(false), on_result = null;			
				
			} else {
				fetch(new Request('https://adclick.g.doubleclick.net' /* NOTE: an option is 'adclick.' */, {method: 'HEAD', mode: 'no-cors'}))
					.then(function (response) {
						// FIXME: false negative in Firefox with 'Adblock' extension, but correctly detects uBlock Origin and Adblock Ultimate
						console.debug('DetectAdblock: not detected!');
						on_result && on_result(false), on_result = null; // NOTE: response.ok always false for HEAD response
					})
					.catch(function (error) {
						console.debug('DetectAdblock: bad news, AdBlock detected...');
						on_result && on_result(true), on_result = null;
					});
			}
			
			try{test.parentNode.removeChild(test);}catch(e){};
		}, 20);
	}

	if (document.body)
		quick_DOM_check();
	else
		document.addEventListener('DOMContentLoaded', quick_DOM_check);
}

DetectAdblock(function (adblock) {
	if (adblock) {
		window.__adblock = true;
		ga && ga('set', 'dimension1', 1); // NOTE: special cohort for Adblock users
	}
});

$(document).ready(function () {
    BootstrapFunnelStage('DocumentReady');
    
	if (console && console.re) {
        trace('embedding console.re intercepting functions');
        
        var orig_log = console.log;
        var orig_info = console.info;
        var orig_warn = console.warn;
        var orig_error = console.error;
        
        function new_warn() { console.warn = orig_warn; console.re.warn(Array.prototype.slice.call(arguments, 0).join(' ')); console.warn = new_warn; }        
        console.warn = new_warn;
        
        function new_log() { console.log = orig_log; console.re.log(Array.prototype.slice.call(arguments, 0).join(' ')); console.log = new_log; }        
        console.log = new_log;
        
        function new_info() { console.info = orig_info; console.re.info(Array.prototype.slice.call(arguments, 0).join(' ')); console.info = new_info; }        
        console.info = new_info;
        
        function new_error() { console.error = orig_error; console.re.error(Array.prototype.slice.call(arguments, 0).join(' ')); console.error = new_error; }        
        console.error = new_error;
                
        trace('console.re embedding success');
    }

    trace("document ready", paks_path + paks_filesystem_file);
    
    if (browser.name === 'Chrome' && browser.version < 59) {
        gtag('event', 'site', {
            'event_category': 'compatibility',
            'event_label': 'outdated_chrome',
            'value': 1,
            'non_interaction': true
        });
        
		if (!CRAWLER_MODE)
			alert('Warning: Google Chrome 59 or greater is required to play this game. Please update your browser.');
    }
    else
    if (browser.name === 'Firefox' && browser.version < 52) {
        gtag('event', 'site', {
            'event_category': 'compatibility',
            'event_label': 'outdated_firefox',
            'value': 1,
            'non_interaction': true
        });
        
		if (!CRAWLER_MODE)
			alert('Warning: Firefox 52 or greater is required to play this game. Please update your browser.');
    }
    else
	if (!wasmAvailable()) {
        gtag('event', 'site', {
            'event_category': 'compatibility',
            'event_label': 'wasm_unsupported',
            'value': 1,
            'non_interaction': true
        });
        
		if (!CRAWLER_MODE)
			alert("Warning: your browser doesn't support WebAssembly, please update it to play the game.");        
    }
		
	trace("loading game module script...");
	
	gtag('event', 'site', {
		'event_category': 'compatibility',
		'event_label': 'success',
		'value': 1,
		'non_interaction': true
	});
	
	GameModule = CreateGameModule();
	LoadScript(gamemodule_path + gamemodule_file, function () {            
		trace("game module script loaded");
		BootstrapFunnelStage('WasmLoaded');
	});
	
	// https://www.khronos.org/webgl/wiki/HandlingContextLost
	var canvas = document.getElementById('canvas');
	canvas.addEventListener("webglcontextlost", function (event) {
		event.preventDefault();
		console.error("WebGL context lost, waiting for context restored...");
		setTimeout(function () {
			console.error("WebGL context restore timeout, last chance redirect...");
			try {
				window.parent.location.replace('//clash3d.com');
			} catch (e) {
				window.location.replace('//clash3d.com');
			}
		}, 2000);
	}, false);	
	canvas.addEventListener("webglcontextrestored", function (event) {
		console.info("WebGL context restored!");
		if (!CRAWLER_MODE)
			alert('Press button to reload the game.');
		try {
			window.parent.location.reload(false);                
		} catch(e) {
			window.location.reload(false);                
		}
	}, false);    
});

if (MOBILE_DEVICE && navigator.wakeLock) { // https://web.dev/wakelock/
	// The wake lock sentinel.
	let wakeLock = null;

	// Function that attempts to request a screen wake lock.
	const requestWakeLock = async () => {
		try {
			wakeLock = await navigator.wakeLock.request('screen');
			wakeLock.addEventListener('release', () => {
				console.log('Screen Wake Lock was released');
			});
			console.log('Screen Wake Lock is active');
			
		} catch (err) {
			console.error(`${err.name}, ${err.message}`);
		}
	};

	const handleVisibilityChange = () => {
		if (wakeLock !== null && document.visibilityState === 'visible') {
			requestWakeLock();
		}
	};

	document.addEventListener('visibilitychange', handleVisibilityChange);
	document.addEventListener('fullscreenchange', handleVisibilityChange);
	
	requestWakeLock();
} 
