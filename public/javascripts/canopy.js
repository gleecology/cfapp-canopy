CloudFlare.define( 'canopy', [       'canopy/config', 'cloudflare/dom',   'cloudflare/user',  'cloudflare/owl',       'cloudflare/jquery1.7',     'cloudflare/console' ], 
                            function(cfg,           dom,                user,               owl,                    jQuery,                     console ) {

    var $ = jQuery; 

    /* config vars:
     *  text_only       [ 0 | 1 ]
     *  scroll          [ 0 | 1 ]
     *  debug           [ 1 | 0 ]
     *  user_pause_ttl  [ -1 | 0 | INT ] seconds
     *  orient          [ left | right | left_bottom | right_bottom ]
     *  ss_view_max_ct  [ 0 | INT ]
     *  view_ttl        [ 0 | INT ]  seconds; but used in MS timer
     *  min_resolution  [ 0 | 1024x0 | 1600x0 ]
     *  http_only       [ 0 | 1 ]  <--
     */

    // integer-gize!
    [ 'text_only', 'scroll', 'debug', 'user_pause_ttl', 'ss_view_max_ct', 'http_only', 'view_ttl', 'LYRM_id' ].map(function(k){
        cfg[k] = parseInt(cfg[k], 10) || 0;
    });

    /*
     * setup vars
     */

    var delim       = '|',
        appName     = 'canopy',
        sessionTTL  = 1200,
        cookieCol   = ['timeFirst','sessionStart','N','sessionCt','sessionViewCt','pauseUntil','pauseSkipCt','impCt'],
        currTs      = function(){ return parseInt( (+(new Date()) / 1000 ), 10 ); },
        currTime    = currTs(),
        httpOnly    = 1,
        sectionId   = ( cfg.text_only ) ? cfg.LYRM_id || '3612448' : cfg.LYRM_id || '3612448',
        V           = cfg.version || '0.0.1',
        D           = cfg.debug || 1,
        cVal        = '',

        installCookie = function(name,val,ttl) {
            var exp = new Date();
            if ( ttl ) { 
                exp.setTime( exp.getTime() + (ttl * 1000) );
            }
            D  &&  console.log( 'installCookie name=' + name + ' val=' + val );
            document.cookie = name + "=" + val + (ttl ? ";expires=" + exp.toUTCString() : '' );
        }, 
    
        readCookieAttrs = function(str) {
            var C = {},
                arr = str ? str.split(delim) : [];
            D  &&  console.log( "readCookieAttrs starts on str", str, arr );

            for ( i = 0; i < cookieCol.length; i++ ){ 
                C[ cookieCol[i] ] = arr[i]  ? parseInt(arr[i], 10) : 0;
            }
            ( C.timeFirst && parseInt(C.timeFirst, 10) && C.timeFirst > 1354151978 )  || ( C.timeFirst  = currTime );
            if ( ! C.sessionStart ) C.sessionStart = currTime;

            D  &&  console.log( "readCookieAttrs returns", C );
            return C;
        },

        writeCookie = function(cName, C, ttl){ 
            var vals = [];
            for ( i = 0; i < cookieCol.length; i++){ 
                vals.push( C[cookieCol[i]] || 0);
            }
            cVal    = vals.join(delim);
            installCookie( cName, cVal, ttl );
        },

        orient      = cfg.orient || 'left',
        isLeft      = orient.indexOf('left') >= 0   ? true : false,
        isBottom    = orient.indexOf('bottom') >= 0 ? true : false,
        useScroll   = cfg.scroll ? true : false,
        minRes      = ( cfg.min_resolution && cfg.min_resolution.indexOf('x') > 0 ) ?  cfg.min_resolution.split('x') : null,

        cookieName  =  'cfapp_canopy',
        cookie      =  readCookieAttrs( user.getCookie(cookieName) ),
        inSession   = (( currTime - cookie.sessionStart ) < sessionTTL ) ? 1 : 0,
        viewport    = dom.getViewport(),
        terminate   = false; 

    /*
     * logic: eligibility, cookie, etc.
     */
    D  &&  console.log( appName " app starts; version="+V+"config:", cfg );

    cookie.N++;

    if (dom.ios || dom.android ){ 
        terminate++;
    }
    if ( window.cf_canopy_disable ) { 
        terminate++;
        D  &&  console.log( "cf_canopy_disable by publisher; terminate="+terminate);
    }
    if ( httpOnly &&  window.location.protocol === 'https:' ){
        terminate++;
        D  &&  console.log( "httpOnly; terminate="+terminate);
    }

    if(  minRes && viewport ) {
        ( minRes[0] && viewport.width ) && ( minRes[0] <= viewport.width || terminate++ );
        ( minRes[1] && viewport.height ) && ( minRes[1] <= viewport.height || terminate++ );
        D  &&  console.log( "minRes check; terminate=" + terminate, minRes, viewport );
    }
    if( cookie.pauseUntil && cookie.pauseUntil >= currTime ){
        cookie.pauseSkipCt++;
        terminate++;
        D  &&  console.log( 'Ad serving is paused; seconds left=' + ( cookie.pauseUntil - currTime ) );
    }
    else if ( cookie.pauseUntil !== 0  ) {
        D  &&  console.log( 'Ad serving was paused; but active again.  Removing cookie setting? ' + cookie.pauseUntil );
        cookie.pauseUntil = 0;
    }

    if (! inSession ){ 
        cookie.sessionCt++;
        cookie.sessionStart     = currTime;
        cookie.sessionViewCt    = 0;
    }
   

    if ( cfg.ss_view_max_ct && cookie.sessionViewCt >= cfg.ss_view_max_ct ) {
        terminate++;
    }else{
        cookie.sessionViewCt++;
        cookie.impCt++;
    }

    writeCookie(cookieName,cookie);

    if ( terminate ) { 
        D   &&  console.log( 'TERMINATE; val='+ terminate );
        return;
    }

    var cfOwl           = owl.createDispatcher(appName);

    D  &&  console.log( 'owl created cfOwl' , cfOwl );

    /* 
     * create HTML
     */

    D  &&  console.log(appName + ' code complete' );

} );
