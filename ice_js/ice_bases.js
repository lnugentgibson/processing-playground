/*global p5*/
/*global dashedLine*/
/*global Base*/

class Bases {
  constructor(lib, grid) {
    if(!lib) {
      lib = {
        /*global SQUARE*/
        SQUARE,
        /*global floor*/
        floor,
        /*global random*/
        random,
        /*global stroke*/
        stroke,
        /*global strokeWeight*/
        strokeWeight,
        /*global strokeCap*/
        strokeCap,
      };
    }
    
    var bases = [];
    grid.forEach((b, p, row, col, i, id) => {
      bases[id] = new Base(lib, id, p);
    });
    var adjacency = [];
    var edges = [];
    function forEachBase(f) {
      bases.forEach(f);
    }
    function forEachEdge(f) {
      edges.forEach((edge) => {
        f.call(null, edge, edge.source, edge.dest);
      });
    }
    Object.defineProperties(this, {
      lib: {
        get: () => lib
      },
      forEachBase: {
        get: () => forEachBase
      },
      forEachEdge: {
        get: () => forEachEdge
      },
      unownedBase: {
        get: () => {
          return () => {
            var unowned = bases.filter((base) => base.owner == undefined);
            return unowned[lib.floor(lib.random(unowned.length))];
          };
        }
      }
    });

    bases.forEach((source) => {
      var ns = grid.kNearest(source.id, 3 + random(3));
      ns.forEach((n) => {
        var row = adjacency[source.id];
        if (!row) {
          row = adjacency[source.id] = [];
        }
        var dest = bases[n.id];
        if (row[dest.id]) {
          return;
        }
        var direction = random() < 0.5;
        row[dest.id] = direction ? 1 : -1;
        row = adjacency[dest.id];
        if (!row) {
          row = adjacency[dest.id] = [];
        }
        row[source.id] = direction ? -1 : 1;
        var outs = (direction ? source : dest).out;
        if (outs == undefined) {
          outs = source.out = [];
        }
        var ins = (direction ? dest : source).in;
        if (ins == undefined) {
          ins = dest.in = [];
        }
        var edge = {
          offset: 0,
          source: direction ? source : dest,
          dest: direction ? dest : source
        };
        outs[dest.id] = edge;
        ins[source.id] = edge;
        edges.push(edge);
      });
    });
  }
  draw() {
    this.forEachBase((base) => {
      base.draw();
    });
    let {lib} = this;
    lib.strokeCap(lib.SQUARE);
    this.forEachEdge((edge, source, dest) => {
      if (source.owner == undefined) {
        lib.stroke(255);
      } else {
        lib.stroke(source.owner.color);
      }
      lib.strokeWeight(2);
      var sp = source.position.copy();
      var dp = dest.position.copy();
      var diff = p5.Vector.sub(dp, sp);
      var dir = diff.copy();
      dir.normalize();
      var shift = dir.copy();
      shift.setMag(32);
      sp.add(shift);
      dp.sub(shift);
      dashedLine(sp, dp, [8, 8], edge.offset);
      edge.offset = (edge.offset + 0.1) % 16;
    });
  }
  update() {
    this.forEachBase((base) => {
      base.update();
    });
  }
}
