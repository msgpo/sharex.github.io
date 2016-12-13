/*jslint browser: true*/
/*global $, jQuery, alert*/

"use strict";

var $window = $(window);
var $animation_elements = $(".animation-element");

function SlideCheck() {
    var window_height = $window.height();
    var window_top_position = $window.scrollTop();
    var window_bottom_position = window_top_position + window_height;

    $.each($animation_elements, function () {
        var $element = $(this);
        var element_height = $element.outerHeight();
        var element_top_position = $element.offset().top;
        var element_bottom_position = element_top_position + element_height;

        if (element_bottom_position >= window_top_position && element_top_position <= window_bottom_position) {
            $element.addClass("slide");
        }
    });
}

function GetLatestReleaseInfo() {
    $.getJSON("https://api.github.com/repos/ShareX/ShareX/releases/latest").done(function (release) {
        var asset = release.assets[0];
        var downloadCount = 0;
        for (var i = 0; i < release.assets.length; i++) {
            downloadCount += release.assets[i].download_count;
        }
        var oneHour = 60 * 60 * 1000;
        var oneDay = 24 * oneHour;
        var dateDiff = new Date() - new Date(asset.updated_at);
        var timeAgo;
        if (dateDiff < oneDay) {
            timeAgo = (dateDiff / oneHour).toFixed(1) + " hours ago";
        } else {
            timeAgo = (dateDiff / oneDay).toFixed(1) + " days ago";
        }
        var releaseInfo = "Version: " + release.tag_name.substring(1) + "\nReleased: " + timeAgo + "\nDownload count: " + downloadCount.toLocaleString();
        $(".sharex-download").attr("href", asset.browser_download_url);
        $(".sharex-download").attr("title", "<a href='downloads/'><div>" + releaseInfo + "</div></a>");

        InitTooltip($(".sharex-download"));
    });
}

function InitTooltip(obj, fadeDelay = 300) {
    obj.tooltip({
        trigger: "manual",
        html: true,
        animation: false
    }).on("mouseenter", function () {
        obj.tooltip("show");
    }).on("mouseleave", function () {
        setTimeout(function () {
            if (!obj.is(":hover") && !$(".tooltip").is(":hover")) {
                obj.tooltip("hide");
            }
        }, fadeDelay);
    });

    obj.parent().on("mouseleave", ".tooltip", function () {
        setTimeout(function () {
            if (!obj.is(":hover") && !$(".tooltip").is(":hover")) {
                obj.tooltip("hide");
            }
        }, fadeDelay);
    });

    if (obj.is(":hover")) {
        obj.tooltip("show");
    }
}

$(document).ready(function () {
    SlideCheck();
    GetLatestReleaseInfo();
});

$window.on("scroll resize", SlideCheck);