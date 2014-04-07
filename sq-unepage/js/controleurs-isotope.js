////////////////////////////////////////////////////////////////
// Controleurs isotopes
////////////////////////////////////////////////////////////////
    function isotope_colorbox_listener(){
      $.colorbox.remove();
      $(".isotope-item:not(.isotope-hidden)").find("a").colorbox({width:'85%',height: '85%', rel:'colorbox-isotope', iframe: true, returnFocus: false, scrolling: true,
        onClosed:function(){isotope_ressources_ferme_tout();}
      });
    }

    function isotope_filtre(val){
        var $this = $(val);

        // don't proceed if already selected
          if ( $this.hasClass('selected') ) return;

        // store filter value in object : i.e. filters.color = 'red'
          var $optionSet = $this.parents('.option-set');
          var group = $optionSet.attr('data-filter-group');
          filters[group] = $this.attr('data-filter-value');
    
        // change selected class
          $optionSet.find('.selected').removeClass('selected');
          $this.addClass('selected');
          logo_menu_change_couleur($this);
          if (group == 'ressource') { isotope_consignes_ferme_tout(); }
          if (group == 'consigne') { isotope_ressources_ferme_tout();  }

        if (vue == 'classes')
        {
        // convert object into array
          var isoFilters = [];
          for ( var prop in filters ) {
            isoFilters.push( filters[ prop ] )
          }
          var selector = isoFilters.join('');
          $container.isotope({ filter: selector });
          isotope_colorbox_listener();
        }

        return false;
    }

    function isotope_option(val){
        var $this = $(val);
        // don't proceed if already selected
          if ( $this.hasClass('selected') ) {
            return false;
          }

        //Change view
          var $optionSet = $this.parents('.option-set');
          $optionSet.find('.selected').removeClass('selected');
          $this.addClass('selected');
          logo_menu_change_couleur($this);

        if (vue == 'classes')
        {
        // make option object dynamically, i.e. { filter: '.my-filter-class' }
          var options = {},
              key = $optionSet.attr('data-option-key'),
              value = $this.attr('data-option-value');

        // parse 'false' as false boolean
          value = value === 'false' ? false : value;
          options[ key ] = value;
          if ( key === 'layoutMode' && typeof changeLayoutMode === 'function' ) {
            // changes in layout modes need extra logic
            changeLayoutMode( $this, options )
          } else {
            // otherwise, apply new options
            $container.isotope( options );
          }
        }
        return false;
    }


////////////////////////////////////////////////////////////////
// Listeneurs Isotopes
//////////////////////////////////////////////////////////////// 
  $().ready(function(){
    //INITIALISATION
        $container = $('#classes'),filters = {};

        $container.isotope({
          itemSelector : '.element',
          masonry: {columnWidth: 80},
          getSortData : {
            date : function ( $elem ) {return $elem.attr('date');},
            notation : function ( $elem ) {return $elem.attr('notation');},            
          },
          sortBy : 'date',
          sortAscending : false
        });

    //FILTRES
        $('.filter a').click(function(){
          isotope_filtre(this);
        });

    //OPTIONS
          var $optionSets = $('.option-set'),
          $optionLinks = $optionSets.find('a');
          $optionLinks.click(function(){
            isotope_option(this);
          });

    //ANIMATIONS
      $(".isotope-item").mouseover(
        function(){
          //$(this).children('.picto').fadeIn(1000);
          $(this).children('.name').fadeIn(1000);

        }
      );
      $(".isotope-item").mouseout(
        function(){
          //$(".picto").stop().fadeOut(0);
          $(".name").stop().fadeOut(0);

        }
      );

    //Listener popups
      isotope_colorbox_listener();

  });
