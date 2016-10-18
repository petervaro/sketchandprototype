/* INFO **
** INFO */

/* Get or set global variable */
var g = g || {};

/*----------------------------------------------------------------------------*/
(function ()
{
    "use strict";


    /*------------------------------------------------------------------------*/
    function Resizer(postsClass,
                     backgroundId)
    {
        this._id          = null;
        this._display     = false;
        this._start       = 0;
        this._opacity     = 0.0;
        this._windowWidth = 0;
        this._posts       = document.getElementsByClassName(postsClass);
        this._postWidth   = this._posts[0].offsetWidth + 2*16;
    }


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype._delta = function ()
    {
        this._end   = Date.now();
        var delta   = (this._end - this._start)/1200;
        this._start = this._end;
        return delta;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype._changed = function ()
    {
        var windowWidth;

        if ((windowWidth = window.innerWidth) === undefined)
            windowWidth = document.body.clientWidth;

        if (this._windowWidth === windowWidth)
            return 0;
        return (this._windowWidth = windowWidth);
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype._distribute = function ()
    {
        var i,
            j,
            style,
            coord,
            coords,
            windowWidth;

        if (!(windowWidth = this._changed()))
            return;

        coords = new g.grid.Triangles(this._postWidth, windowWidth);
        for (i=0; i<this._posts.length; i++)
        {
            coord = coords.next();
            for (j=0; j<2; j++)
                if (Math.round(Math.random()))
                    coord = coords.next();

            style = this._posts[i].style;

            style.top        = coord[1].toString() + 'px';
            style.left       = coord[0].toString() + 'px';
            style.opacity    = '0.0';
            style.visibility = 'visible';
        }

        this._show();
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype._show = function ()
    {
        if (this._display)
            return;

        var i,
            opacity,
            delta = this._delta();

        if ((this._opacity += delta) < 1.0)
            window.requestAnimationFrame(this._show.bind(this));
        else
        {
            this._opacity = 1.0;
            this._display = true;
        }

        opacity = this._opacity.toString();
        for (i=0; i<this._posts.length; i++)
            this._posts[i].style.opacity = opacity;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype._hide = function ()
    {
        if (!this._display)
            return;

        var i,
            opacity,
            windowWidth,
            delta = this._delta();

        if (!(windowWidth = this._changed()))
            return;

        if ((this._opacity -= delta) > 0.0)
            window.requestAnimationFrame(this._hide.bind(this));
        else
        {
            this._opacity = 0.0;
            this._display = false;
        }

        opacity = this._opacity.toString();
        for (i=0; i<this._posts.length; i++)
            this._posts[i].style.opacity = opacity;
    };


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Resizer.prototype.callback = function ()
    {
        window.clearTimeout(this._id);
        this._id = setTimeout(this._distribute.bind(this), 200);
        this._hide();
    };


    /*------------------------------------------------------------------------*/
    /* Export variables */
    g.resizer =
    {
        Resizer : Resizer,
    };
})();
