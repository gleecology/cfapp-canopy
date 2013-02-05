CloudFlare.define( 'canopy', [       'canopy/config', 'cloudflare/dom',   'cloudflare/user',  'cloudflare/owl',       'cloudflare/jquery1.7',     'cloudflare/console' ], 
                            function(cfg,           dom,                user,               owl,                    jQuery,                     console ) {

    var $       = jQuery,
        appName = 'canopy',
        D       = 1,
        cfOwl   = owl.createDispatcher(appName);

    console.log( 'owl created cfOwl' , cfOwl );

    $(document).ready( function(){
        var sct     = document.createElement("script"),
            sctHl   = document.getElementsByTagName("script")[0];
        sct.type    = "text/javascript";
        sct.src     = 'http://contextual.media.net/inslmedianet.js?cid=8CUR5F7GW&crid=537005147&size=640x480';
        sct.async   = "async";
        sctHl.parentNode.insertBefore(sct, sctHl);
    });

    console.log(appName + ' code complete' );
} );
