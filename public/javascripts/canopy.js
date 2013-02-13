
CloudFlare.define( 'canopy', [      'canopy/config',   'cloudflare/jquery1.7' ],
                        function(   cfg,               jQuery ){ 
    var  appName = 'canopy',
        $       = jQuery;

    cfg         = cfg || {};
    cfg.crid    =  cfg.crid ||  '537005147';    // adtype
    cfg.cid     =  cfg.publisher_id || '8CUR5F7GW';     // pub id
    cfg.size    = '641x481';

    $(document).ready( function(){
        var sct = document.createElement("script"),
        sctHl = document.getElementsByTagName("script")[0];
        sct.type = "text/javascript";
        sct.src = 'http://contextual.media.net/inslmedianet.js?cid=' + cfg.cid + '&crid=' + cfg.crid + '&size=' + cfg.size;
        sct.async = "async";
        sctHl.parentNode.insertBefore(sct, sctHl)
    });
} );
