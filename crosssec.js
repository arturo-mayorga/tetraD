var sqrt5 = Math.sqrt(5);

var geom = {
    v:
    [
        [ 1,  1,  1, -1/sqrt5],
        [ 1, -1, -1, -1/sqrt5],
        [-1,  1, -1, -1/sqrt5],
        [-1, -1,  1, -1/sqrt5],
        [ 0,  0,  0, sqrt5 - 1/sqrt5]
    ],
    t:
    [ 
        [0, 1, 2, 3],
        [0, 1, 2, 4],
        [0, 1, 3, 4],
        [0, 2, 3, 4],
        [1, 2, 3, 4]
    ]
};

// return an array of 3d points for the 
// cross section of a 4d line
function lineCrossSection(p0, p1)
{
    if (p0[3] * p1[3] > 0)
    {
        return [];
    }

    if (p0[3] === 0 && p1[3] === 0)
    {
        return [ [p0[0], p0[1], p0[2]], [p1[0], p1[1], p1[2]] ];
    }

    if (p0[3] === 0)
    {
        return [ [p0[0], p0[1], p0[2]] ];
    }

    if (p1[3] === 0)
    {
        return [ [p1[0], p1[1], p1[2]] ];
    }

    var k = p0[3] / (p0[3] - p1[3]);
    var kp = 1 - k;
    var point = [0,0,0];
    
    for (var i = 0; i < 3; ++i)
    {
        point[i] = kp * p0[i] + k * p1[i];
    }

    return [ point ];
}


// return an array of triangles in 3d space
// that represent the cross section of a 4d tetraheadron 
// to the the 3d space at w == 0
function getCrossSection(tetra)
{
    var i = 0;
    var points = [];

    points = lineCrossSection(tetra[0], tetra[1]).concat(points);
    points = lineCrossSection(tetra[0], tetra[2]).concat(points);
    points = lineCrossSection(tetra[0], tetra[3]).concat(points);
    points = lineCrossSection(tetra[1], tetra[2]).concat(points);
    points = lineCrossSection(tetra[2], tetra[3]).concat(points);
    points = lineCrossSection(tetra[3], tetra[1]).concat(points);

    points.sort(function(a, b)
    {
        for (i = 0; i < 3; ++i)
        {
            if (a[i] < b[i])
            {
                return -1;
            }
            else if (a[i] > b[i])
            {
                return 1;
            }
        }

        return 0;
    });

    var tri = [];

    for (i = 0; i < points.length; ++i)
    {
        if (i === 0 || 
            (points[i][0] !== points[i-1][0] ||
             points[i][1] !== points[i-1][1] || 
             points[i][2] !== points[i-1][2]))
        {
            tri.push(points[i]);
        }
    }

    points = tri;
    // TODO: is it possible to end up with more than 4 points here?

    tri = []; 

    if (points.length === 2)
    {
        tri.push([points[0], points[1], points[1]]);
    }
    
    if (points.length === 3)
    {
        tri.push([points[0], points[1], points[2]]);
    } 

    if (points.length === 4)
    {
        tri.push([points[0], points[1], points[2]]);
        tri.push([points[0], points[1], points[3]]);
        tri.push([points[0], points[2], points[3]]);
        tri.push([points[1], points[2], points[3]]);
    }

    return tri;
}

function render(triangles)
{
    for (var i = 0; i < triangles.length; ++i)
    {
        console.log(JSON.stringify(triangles[i]));
    }
}

function main()
{
    var ta = geom.t;
    var v = geom.v;
    var i = 0; var j = 0;
    var geom3d = [];

    for ( i = 0; i < ta.length; ++i)
    {
        var t = ta[i];
        var tetra = [v[t[0]], v[t[1]], v[t[2]], v[t[3]]];
        var cross = getCrossSection(tetra);

        for (j = 0; j < cross.length; ++j)
        {
            geom3d.push(cross[j]);
        } 
    }

    getCrossSection([[1,1,1,0], [1,-1,-1,0], [-1,1,-1,0], [-1,-1,1,0]]);

    render(geom3d);
}

main();


