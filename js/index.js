/* INFO **
** INFO */

/* Get or set global variable */
var g = g || {};

/*----------------------------------------------------------------------------*/
function main()
{
    "use strict";

    var resizer = new g.resizer.Resizer('content-bottom-post');

    /* Register event callback when resizing window */
    if (window.addEventListener)
        window.addEventListener('resize', resizer.callback.bind(resizer));
    else
        window.attachEvent('onresize', resizer.callback.bind(resizer));

    /* Initial call for resizing */
    resizer.callback();
}
