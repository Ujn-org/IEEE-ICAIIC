// Misc helper scripts for the SIGCOMM web

$(document).on("pagebeforeshow", function() {

  try { 
    /* Hide news list items on page show. */
    var newslibtn = $.mobile.activePage.find(".newslibtn");

    if (newslibtn != null) {
      $(newslibtn).siblings().slice(6).hide(); 
      $(newslibtn).find("a").text("Older News");
      $(newslibtn).find("span").toggleClass("ui-icon-plus", true);
      $(newslibtn).find("span").toggleClass("ui-icon-minus", false);
    }

    /* Configure sponsor ticker tape */
    var logobar = $.mobile.activePage.find(".logobar");

    if (logobar != null) {
      init_sps();
      resize();
    }
    
  } catch (err) {
    // alert (err);
  }
  
});

$(document).on("pageshow", function() {

  try { 
    /* Hack to prevent data-filter from reducing page size and making scrolling buggy. */
    var uicontainer = $.mobile.activePage.find(".ui-content");
  
    if (uicontainer != null) {
      $(uicontainer).css('min-height', $(uicontainer).height());
    }

    /* Reinitialize program table on return from another page */
    var program = $.mobile.activePage.find(".sigcomm-program");
  
    if (program != null) {
      $('input[data-type="search"]').val("");
      $('input[data-type="search"]').trigger("keyup");

      filter("all");
    }
    
  } catch (err) {
    // alert (err);
  }
    var swiper = new Swiper('.swiper-container', {
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
});

/* Show/hide list items on newslibtn click. */

function showall(divname) {
    var newslibtn = $.mobile.activePage.find(".newslibtn");
    
    if (newslibtn != null) {
      $(newslibtn).find("span").toggleClass("ui-icon-plus ui-icon-minus");
 
      if ($(newslibtn).find("span").hasClass('ui-icon-minus')) {
        $(newslibtn).siblings().show();
        $(newslibtn).find("a").text("Hide Older News");
      } else {
        $(newslibtn).siblings().slice(6).hide();
        $(newslibtn).find("a").text("Older News");
      }
    }
}

/* Show/hide paper abstract. */

function showabstract(paper_id) {
    var paper = $.mobile.activePage.find(paper_id);
    var paper_toggle = $.mobile.activePage.find(paper_id + '-toggle');
    
    if (paper != null) {
      $(paper_toggle).toggleClass("ui-icon-carat-d ui-icon-carat-u");
      $(paper).toggle("hide"); 
    }
}

/* Show/hide paper video. */

function showvideo(paper_id, video_fname, video_ext, video_url) {
  var paper = $.mobile.activePage.find(paper_id);
    
  if (paper != null) {
    $(paper).toggle("hide", function() {
      if($(this).is(':hidden')) {
        $(this).html('<hr class="keynote-divider"/>' + 
                     '<p>&nbsp;</p><p>You may also <a rel="external" href="'+ video_url + '">download the video</a>.</p>');
      } else {
       $(this).html('<hr class="keynote-divider"/>' + 
                    '<center><video controls preload="none">'+
		    '  <source src="' + video_fname + '" type="video/'+ video_ext + '">' +
		    '  Your browser does not support the video tag.' +
		    '</video></center>' +
		    '<p>&nbsp;</p><p>You may also <a rel="external" href="'+ video_url + '">download the video</a>.</p>');
      }
    }); 
  }
}

/* sponsors ticker tape, adapted from sigcomm 2012 code */

(function(a, b) {
    var c = function(a, c, b) {
        var f;
        return function() {
            var g = this,
            h = arguments;
            f ? clearTimeout(f) : b && a.apply(g, h);
            f = setTimeout(function() {
            b || a.apply(g, h);
            f = null
            }, c || 100)
        }
    };
    jQuery.fn[b] = function(a) {
        return a ? this.bind("resize", c(a)) : this.trigger(b)
    }
})(jQuery, "smartresize");

function resize() {
  try {
    var logobar = $.mobile.activePage.find(".logobar");
    
    scrh = $(window).height();
    scrw = $(window).width();
    logoh = scrh / 12 + 30;
    logow = Math.max(200, scrw / 6);
    lidx = gidx = 0;
    logos = 0.8;
    lcnt = parseInt(scrw / logow, 10);
    $(logobar).html("");
    ticker_tape();
  }
  catch (err) {
    // alert (err);
  }
}

$(window).smartresize(resize);

function shuffle(a) {
    for (var b, c, d = a.length; d; b = parseInt(Math.random() * d, 10), c = a[--d], a[d] = a[b], a[b] = c);
    return a;
}

function init_sps() { 
    // shuffle(sps);
    for (var a = 1; a < sps.length; a++)
      sps[a][0] = sps[a - 1][0] + sps[a][0];
}

function choose_logo_idx() {
    var a = -1;
    if (gidx < sps.length) a = gidx;
    else {
        for (var b = sps[sps.length - 1][0] + 1, b = parseInt(Math.random() * b, 10), c = 0; c < sps.length; c++)
            if (b <= sps[c][0] && 0 === sps[c][4]) {
            a = c;
            break;
            }
        if (0 > a)
            for (b = 0; b < sps.length; b++)
            if (0 === sps[b][4]) {
                a = b;
                break;
            }
    }
    sps[a][4] = 1;
    gidx += 1;
    return a;
}

function onfinish() {
    if (!(lcnt >= sps.length)) {
        var a = lidx % lcnt;
        var mylogo_a = $.mobile.activePage.find("#mylogo" + a);
        var mylink_a = $.mobile.activePage.find("#mylink" + a);
        
        lidx += 1;
        var b = choose_logo_idx(),
            c = parseInt($(mylogo_a).attr("alt"), 10);
        
        $(mylogo_a).fadeOut(500, function() {
            sps[c][4] = 0;
            $(mylogo_a).attr("src", "images/sponsors/" + sps[b][1]);
            $(mylogo_a).attr("alt", b);
            $(mylink_a).attr("href", sps[b][2]);
            var d = logos * logoh,
            e = logos * logow;
            d / e < sps[b][5] / sps[b][6] ? ($(mylogo_a).attr("height", d + "px"), $(mylogo_a).removeAttr("width")) : ($(mylogo_a).removeAttr("height"), $(mylogo_a).attr("width", e + "px"));
            $(mylogo_a).fadeIn(500);
        })
    }
}

function get_logo(a) {
    var b = choose_logo_idx(),
        c = "images/sponsors/" + sps[b][1],
        d = logos * logoh,
        e = logos * logow,
        i = sps[b][5],
        f = sps[b][6],
        a = "<td width='" + parseInt(100 / lcnt, 10) + "%'><a id='mylink" + a + "' href='" + sps[b][2] + "'><img id='mylogo" + a + "' src='" + c + "' alt='" + b + "' style='display:block; margin:auto;' ";
    return a = (d / e < i / f ? a + " height='" + d + "px'>" : a + " width='" + (e - 10) + "px'>") + "</a></td>";
}

function ticker_tape() {
  try {
    var logobar = $.mobile.activePage.find(".logobar");
    var content = $.mobile.activePage.find(".leftnav");
    
    $(logobar).css("height", logoh + "px");
    $(content).css("padding-bottom", 1.25 * logoh + "px");
    $(logobar).append("<table width='100%' height='100%' cellspacing='0' cellpadding='0' border='0' valign='middle'><tr class='logobarrow'></tr></table>");

    var logobarrow = $.mobile.activePage.find(".logobarrow");
    for (var a = 0; a < lcnt; a++)
      nlogo = get_logo(a), $(logobarrow).append(nlogo);
  }
  catch (err) {
    // alert(err);
  }
}

setInterval(function() {
   // onfinish()
}, 3E3);

/* conference program filtering (code from previous years does not seem to work with jquery-1.4.5) */

function filter(progitem) {
  try {

    // using show() and hide() methods does not work well with li rouding, so we need to 
    // manually handle them. first, we disable rouding for current first and last items
    $(".prog-item").toggleClass('listfirst listlast', false);

    // go after all .prog-item items according to the day of the week to be displayed
    // for some particular date, hide all then show only those items having its class
    if (progitem == "all") {
      $('.prog-item').show();
    } else {
      $('.prog-item').hide();
      $('.prog-' + progitem).show();
    }

    // the date header should always be visible, that's why we use a display: block
    // however, we want to hide it if we are not displaying that particular date
    var kids = $.mobile.activePage.find(".program").children('li');
    kids.each(function () {
      if ($(this).hasClass("prog-header")) {
        if (progitem == "all" || $(this).hasClass('prog-' + progitem)) {
          $(this).toggleClass( 'prog-no-filter', true);
        } else {
          $(this).toggleClass( 'prog-no-filter', false);
        }
      }
    });

    // finally, include rouding to first and last visible items only
    $(".prog-item").filter(":visible").first().toggleClass('listfirst', true);
    $(".prog-item").filter(":visible").last().toggleClass('listlast', true);

  } catch (err) {
    // alert( err);
  }
}