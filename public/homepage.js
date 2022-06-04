$(".homepageButton").click(function(){
    $(".modal").addClass("visible");
  });
  
  $(".js-close-modal").click(function(){
    $(".modal").removeClass("visible");
  });
  
  $(document).click(function(event) {
    //if you click on anything except the modal itself or the "open modal" link, close the modal
    if (!$(event.target).closest(".modal,.homepageButton").length) {
      $("body").find(".modal").removeClass("visible");
    }
  });