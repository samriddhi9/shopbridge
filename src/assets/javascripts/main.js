$(document).ready(function () {

    /* $("#content").css("height", $(window).height() - $("#controls").innerHeight() - $("#user-controls").innerHeight() - 35 ); */

    $("#sidebar #toggle-button").on("click", function () {
        $("body").toggleClass("menu-expanded");
        return false;
    });

    if ($(window).width() <= 767 && $("body").hasClass("menu-expanded")) {
        $("#sidebar .back-btn a").click();
    }

    $(window).on("resize", function () {
        if ($(window).width() <= 767 && $("body").hasClass("menu-expanded")) {
            $("#sidebar .back-btn a").click();
        }
    });

    $(".popup-trigger").on("click", function () {
        $This = $(this).parents(".widget");
        $ThisWrapper = $(this).parents(".widget").find(".widget-content");

        $($(this).attr("data-trigger")).modal("show");

        $This.addClass("after_modal_appended");

        $('.modal-backdrop').appendTo($ThisWrapper);

        $('body').removeClass("modal-open")
        $('body').css("padding-right", "");

        return false;

    });


    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $(".wizard .nav-tabs li").removeClass("completed");
        $(e.target).parent().prevAll().addClass("completed");
    });

    // $('#datatables').DataTable({
    //     "dom": '<"top"i>rt<"bottom"flp><"clear">',
    //     searching: false,
    //     "bInfo": false,
    //     "ordering": false,
    //     responsive: true,
    //     oLanguage: {
    //         sLengthMenu: "Show _MENU_",
    //     }
    // });



    // $(window).on("resize", function () {
    //     $('#datatables').DataTable().destroy();

    //     $('#datatables').DataTable({
    //         "dom": '<"top"i>rt<"bottom"flp><"clear">',
    //         searching: false,
    //         "bInfo": false,
    //         "ordering": false,
    //         responsive: true,
    //         oLanguage: {
    //             sLengthMenu: "Show _MENU_",
    //         }
    //     });
    // });

});
