import {u} from "./u.js";

let $div;

function show(e) {
    const $t = $(e.target);
    if (!$t) {
        return
    }

    const $div = getDiv();
    $('.tooltip_date', $div).html($t.data('date'));
    $('.tooltip_name', $div).html($t.data('key'));
    $('.tooltip_cost', $div).html(u.formatCostTip($t.data('cost')));

    $div.show()
    //.fadeIn(200)
}

function hide() {
    getDiv().hide()
    //$tooltip.fadeOut(200)
}

function move(e) {
    getDiv().css({
        left: u.px(e.pageX - 50),
        top: u.px(e.pageY - 80)
    })
}

function getDiv() {
    if ($div) {
        return $div;
    }
    $div = $('<div class="tooltip"><div class="tooltip_date"></div><div class="tooltip_name"></div><div class="tooltip_cost"></div></div>')
        .appendTo("body");
    return $div
}

const Tooltip = {show, hide, move};
export {Tooltip};

