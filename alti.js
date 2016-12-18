(function() {
    var i,
        marker_len,
        stroke_width,
        width = 300,
        height = 300,
        center = {
            x: width / 2,
            y: height / 2,
        },
        bg_color = '#333',
        dial_color = '#101010',
        dial_stroke_width = 5,
        dial_stroke_color = '#CCC',
        marker_radius = 145,
        number_circle_radius = 110;

    // instantiate new drawing area
    var svg = d3.select("#imageContainer").append("svg")
                .attr({
                    width: width,
                    height: height
                });

    // dial
    svg.append("circle")
        .attr({
            cx: center.x,
            cy: center.y,
            r: (width - dial_stroke_width) / 2,
            stroke: dial_stroke_color,
            'stroke-width': dial_stroke_width,
            fill: dial_color
        });

    // svg.append('circle')
    //     .attr({
    //         cx: center.x,
    //         cy: center.y,
    //         r: 88,
    //         fill: '#222'
    //     });

    // markers & numbers
    for (i = 0; i < 50; i++) {
        marker_len = i % 5 == 0 ? 15 : 10;
        stroke_width= i % 5 == 0 ? 4 : 2;

        svg.append("line")
            .attr({
                x1: width / 2 + marker_radius * Math.sin(i * Math.PI / 25),
                y1: height / 2 + marker_radius * Math.cos(i * Math.PI / 25),
                x2: width / 2 + (marker_radius - marker_len) * Math.sin(i * Math.PI / 25),
                y2: height / 2 + (marker_radius - marker_len) * Math.cos(i * Math.PI / 25),
                stroke: 'white',
                "stroke-width": stroke_width
            });

        if (i % 5 == 0) {
            svg.append('text')
                .attr({
                    class: 'dial-numbers',
                    x: width / 2 + number_circle_radius * Math.sin(i * Math.PI / 25),
                    y: height / 2 - number_circle_radius * Math.cos(i * Math.PI / 25),
                    dy: '0.35em'
                })
                .text(i / 5);
        }
    }

    // 100 Feet & ALT markings
    svg.append('text')
        .attr({
            class: 'hundred-feet',
            x: 86,
            y: 67,
            transform: 'rotate(-18)'
        })
        .text('100');

    svg.append('text')
        .attr({
            class: 'hundred-feet',
            x: 173,
            y: -26,
            transform: 'rotate(18)'
        })
        .text('FEET');

    svg.append('text')
        .attr({
            class: 'alt-label',
            x: 80,
            y: 125,
        })
        .text('ALT');

    // QNH window
    var large_radius = 133,
        small_radius = 88,
        window_angle = 5,
        urc = {},
        ulc = {},
        lrc = {},
        llc = {};
    urc.x = center.x + large_radius * Math.cos(- Math.PI * window_angle / 180);
    urc.y = center.y + large_radius * Math.sin(- Math.PI * window_angle / 180);
    lrc.x = center.x + large_radius * Math.cos(Math.PI * window_angle / 180);
    lrc.y = center.y + large_radius * Math.sin(Math.PI * window_angle / 180);
    ulc.x = center.x + small_radius * Math.cos(- Math.PI * window_angle / 180);
    ulc.y = urc.y;
    llc.x = center.x + small_radius * Math.cos(Math.PI * window_angle / 180);
    llc.y = lrc.y;

    svg.append('path')
        .attr({
            d: 'M' + urc.x + ',' + urc.y +
                    'A' + large_radius + ',' + large_radius + ' 0 0,1 ' + lrc.x + ',' + lrc.y +
                    'L' + llc.x + ',' + llc.y +
                    'A' + small_radius + ',' + small_radius + ' 0 0,0 ' + ulc.x + ',' + ulc.y +
                    'L' + urc.x + ',' + urc.y + ' Z',
            stroke: 'white',
            'stroke-width': 2,
            'stroke': '#666',
            fill: '#222'
        });

    svg.append('text')
        .attr({
            x: (llc.x + lrc.x) / 2,
            y: center.y,
            dy: '0.35em',
            class: 'qnh-text'
        })
        .text('29.92');

    var g = svg.append('g')
        .attr('transform', 'translate(' + center.x + ',' + center.y + ')');

    // tens of thousands, lol
    var first_hand = g.append('g');
    first_hand.append('path')
        .attr({
            d: 'M2,0 L2,-125 L10,-142 L-10,-142 L-2,-125 L-2,0 Z',
            fill: 'white',
            stroke: '#333',
            'stroke-width': 2
        });
    first_hand.append('circle')
        .attr({
            cx: 0,
            cy: 0,
            r: 12,
            fill: '#333',
            stroke: '#444'
        });


    // thousand feet hand
    var second_hand = g.append('g');
    second_hand.append('path')
        .attr({
            d: 'M3,0 L10,-60 L0,-80 L-10,-60 L-3,0 Z',
            fill: 'white',
            stroke: '#666'
        });
    second_hand.append('circle')
        .attr({
            cx: 0,
            cy: 0,
            r: 10,
            fill: '#333',
            stroke: '#444'
        });

    // hundred feet hand
    var third_hand = g.append('g');
    third_hand.append('path')
        .attr({
            d: 'M4,0 L4,-130 L0,-140 L-4,-130 L-4,0 Z',
            fill: 'white',
            stroke: '#666'
        });
    third_hand.append('circle')
        .attr({
            cx: 0,
            cy: 0,
            r: 8,
            fill: '#333',
            stroke: '#444'
        });
    third_hand.append('circle')
        .attr({
            cx: 0,
            cy: 0,
            r: 2,
            fill: '#111',
            stroke: '#444'
        });


    //=====================
    function set_altitude(alt) {
        var thousands = alt % 10000;
        var angle = (360 * alt / 10000) % 360;
        second_hand.attr('transform', 'rotate(' + angle + ')');
        thousands = alt % 1000;
        angle = (360 * alt / 1000) % 360;
        third_hand.attr('transform', 'rotate(' + angle + ')');
        thousands = alt % 100000;
        angle = (360 * alt / 100000) % 360;
        first_hand.attr('transform', 'rotate(' + angle + ')');
    }


    // animation!
    var altitude = 0;
    d3.timer(function(ms) {
        altitude += 10;
        set_altitude(altitude);
        if (altitude >= 15000) return true;
    });
    // set_altitude(13678);
})();



















