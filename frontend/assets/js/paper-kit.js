/*!

 =========================================================
 * Paper Kit 2 - v2.0.0
 =========================================================

 * Product Page: http://www.creative-tim.com/product/paper-kit-2
 * Copyright 2017 Creative Tim (http://www.creative-tim.com)
 * Licensed under MIT (https://github.com/timcreative/paper-kit/blob/master/LICENSE.md)

 =========================================================

 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 */



        var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
        (function(){
        var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
        s1.async=true;
        s1.src='https://embed.tawk.to/5bfa864779ed6453ccab0469/default';
        s1.charset='UTF-8';
        s1.setAttribute('crossorigin','*');
        s0.parentNode.insertBefore(s1,s0);
        })();

        

    (function (){
        var options = {
            whatsapp: "+966544038879", // WhatsApp number
            position: "right", // Position may be 'right' or 'left'
        };
        var proto = document.location.protocol, host = "whatshelp.io", url = proto + "//static." + host;
        var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
        s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
        var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
    })();

//     $('.navbar-nav>li>a').on('click', function(){
//         $('.navbar-collapse').collapse('hide');
//         console.log("hide clicked");
//         //this.toggleButton.classList.remove('toggled');
//         $( 'html' ).removeClass( "nav-open" )
//         width="222" height="200"
//    });
    

var feed = new Instafeed(
      {

        //247051326.44de5cd.395abdeb272f440ab6ebba54f6695ec4
          get: 'user',
          userId: '247051326',
          accessToken: '247051326.44de5cd.395abdeb272f440ab6ebba54f6695ec4',
          limit: 12,
          template: '<a class="m-0 p-0 col-md-1 col-sm-1 col-xs-1 img-inasta" target="_blank" href="{{link}}"> <img src="{{image}}" class="imge-mobile img-responsive"/></a>',

         // Hide the backup shown if the intagram send response
          success: function(){
            test = document.getElementById("instafeed_");
            test.className += " d-none";
           }
      });
      feed.run();

     