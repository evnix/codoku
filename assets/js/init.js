$(document).ready(function () {

    CODOKU.loadConfig()

});

window.CODOKU = {};
CODOKU.config = {}


CODOKU.loadConfig = function () {

    var root = null;
    var useHash = true; // Defaults to: false
    var hash = '#!'; // Defaults to: '#'
    window.router = new Navigo(root, useHash, hash);

    CODOKU.converter = new showdown.Converter({tables: true});
    CODOKU.converter.setFlavor('github');


    window.router.on('*', function (param) {

        CODOKU.loadPage()


    }).resolve();

    $.get("config.json", function (data) {

        CODOKU.config = data;
        CODOKU.setTitle();
        CODOKU.setNameLogo();
        CODOKU.renderMenu();

    }).fail(function () {
        alert("[error]: while parsing config json");
    });

};


CODOKU.loadPage = function () {


    var path = document.location.hash + "";
    path = path.replace("#!", "")

    if (path === "") {
        path = "index"
    }

    path = "content/" + path


    var jumpTo = CODOKU.getQueryStringData('jump');
    if (jumpTo !== null) {
        path = path.split("?")[0];
    }

    if (!path.endsWith(".md")) {

        path = path + ".md"
    }


    $.ajax({
            type: "GET",
            url: path,
            error: function (xhr, statusText) {
                $('#content').html("Error: " + statusText + ". ErrorCode: " + xhr.status);
            },
            success: function (msg) {

                $('#content').html(CODOKU.converter.makeHtml(msg));

                if (jumpTo !== null) {


                    if ($('#' + jumpTo).length) {
                        $('#' + jumpTo)[0].scrollIntoView();

                    } else {

                        console.log("jump element does not exist: " + jumpTo)
                    }

                } else {
                    $(window).scrollTop(0);
                }
                $('#content pre code').each(function (i, block) {
                    hljs.highlightBlock(block);
                });

                var headTags = $('#content > :header:first');


                if (headTags.length > 0) {
                    CODOKU.documentTitle = headTags[0].innerHTML
                    CODOKU.setTitle();
                }

            }


        }
    )
}

CODOKU.setNameLogo = function () {

    if (CODOKU.config.logo === "") {

        $('#nameLogo').html(CODOKU.config.name)

    } else {

        var img = '<img src="' + CODOKU.config.logo + '" alt="' + CODOKU.config.name + '" />'
        $('#nameLogo').html(img)
    }

}

CODOKU.setTitle = function () {

    if (CODOKU.documentTitle === undefined) {
        document.title = CODOKU.config.title;
    } else {
        document.title = CODOKU.documentTitle;
    }

    CODOKU.attachPrefix()
    CODOKU.attachSuffix()
}

CODOKU.attachPrefix = function () {

    if (CODOKU.config.prefixTitle === undefined
        || CODOKU.config.prefixTitle === ""
        || document.location.hash == ""
    )
        return;

    document.title = CODOKU.config.prefixTitle + document.title;
}

CODOKU.attachSuffix = function () {

    if (CODOKU.config.suffixTitle === undefined
        || CODOKU.config.suffixTitle === ""
        || document.location.hash == "")
        return;

    document.title = document.title + CODOKU.config.suffixTitle;
}


CODOKU.renderMenu = function () {


    CODOKU.menuArr = [];
    CODOKU.generateMenu(CODOKU.config.links, '#sidebar')
    var res = CODOKU.menuArr.join("");
    $('#codokuMenu').html(res)
    CODOKU.menuArr = [];
}

CODOKU.generateMenu = function (links, parent) {

    links.map(function (link) {

        //console.log(link['name'])

        if (link['links'] !== undefined) { //has submenu
            //console.log("entering "+link['name'])

            if (link.href === undefined || link.href === "") {
                link.href = '#codoku-p-' + parent.replace(/#/g, "")
            }


            CODOKU.renderPlaceHolder(link, parent)


        } else {

            CODOKU.renderLink(link, parent)

        }

    })

}

CODOKU.renderPlaceHolder = function (link, parent) {

    var icon = '';

    if (link['icon'] !== undefined || link['icon'] !== "") {

        icon = '<i class="' + link.icon + '"></i> ';
    }


    var str = '<a href="' + link.href + '" class="list-group-item collapsed" data-toggle="collapse" aria-expanded="false">'
        + icon
        + link.name
        + '</a>'


    CODOKU.pushMenuArr(str)

    CODOKU.pushMenuArr('<div class="collapse" id="' + link.href.replace(/#/g, "") + '">')

    CODOKU.generateMenu(link.links, link.href)

    CODOKU.pushMenuArr('</div>')

}

CODOKU.renderLink = function (link, parent) {


    if (link['links'] === undefined) {

        var Elclass = '';
        var newTab = '';
        var icon = '';

        if (parent === '#sidebar') {
            Elclass = ' d-inline-block collapsed '
        }

        if (link['newTab'] !== undefined && link['newTab'] === true) {
            newTab = ' target="_blank" ';
        }

        if (link['icon'] !== undefined && link['icon'] !== "") {
            icon = '<i class="' + link.icon + '"></i> ';
        }

        link.href = CODOKU.formatLink(link.href)

        var str = '<a href="' + link.href + '"' + newTab + ' class="list-group-item ' + Elclass + '" data-parent="' + parent + '">' +
            icon +
            '<span class="hidden-sm-down">' + link.name + '</span>' +
            '</a>';

        CODOKU.pushMenuArr(str)
    }
};

CODOKU.formatLink = function (link) {

    if (link.startsWith("http://") || link.startsWith("https://")) {
        return link;
    }

    if (link.endsWith('.md')) {

        link = link.replaceLast(".md", "");
    }

    if (!link.startsWith("#!")) {
        link = "#!" + link;
    }

    return link;

}

CODOKU.pushMenuArr = function (text) {

    CODOKU.menuArr.push(text)
    //console.log(text)

}

CODOKU.getQueryStringData = function (name) {
    var result = null;
    var regexS = "[\\?&#]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec('?' + window.location.href.split('?')[1]);
    if (results != null) {
        result = decodeURIComponent(results[1].replace(/\+/g, " "));
    }
    return result;
};

String.prototype.replaceLast = function (what, replacement) {
    var pcs = this.split(what);
    var lastPc = pcs.pop();
    return pcs.join(what) + replacement + lastPc;
};






