/* INFO **
** INFO */

/* Get or set global variable */
var g = g || {};

/*----------------------------------------------------------------------------*/
(function ()
{
    "use strict";

    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    /* Internal constants */
    var ALTITUDE_CONST = Math.sqrt(3)/2;

    /*------------------------------------------------------------------------*/
    /* Triangle/diamond grid generator object */
    function Triangles (base,   /* Triangle base */
                        limit)  /* Width limit */
    {
        var x,
            v;
        this._lcols = [];
        this._scols = [];
        this._step  = base*ALTITUDE_CONST;

        limit = limit >= base*2.5 ? limit-=base : Math.round(base*2.5);
        x = Math.round((limit - Math.floor(limit/base)*base)/2);

        /* Long columns */
        for (v=x; v<limit; v+=base)
            this._lcols.push(v);

        /* Short columns */
        limit-=base/2;
        for (v=x+base/2; v<limit; v+=base)
            this._scols.push(v);

        /* Generator states */
        this._i    = 0;
        this._y    = 0;
        this._cols = this._lcols;
    }


    /*- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - */
    Triangles.prototype.next = function ()
    {
        var x = this._cols[this._i],
            y = this._y;

        if (x === undefined)
        {
            /* Swap columns */
            this._cols = this._cols === this._lcols ? this._scols : this._lcols;

            /* Get first of column and increase y */
            x = this._cols[this._i = 0];
            y = this._y += this._step;
        }

        ++this._i;
        return [x, y];
    };


    /*------------------------------------------------------------------------*/
    /* Export variables */
    g.grid =
    {
        Triangles : Triangles,
    };
})();
