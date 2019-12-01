import java.util.HashSet;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Set;

class Structure {
  ArrayList<Link> links;
  ArrayList<Segment> segments;
  Field field;
  float delta;
  Structure(Field _field) {
    field = _field;
    delta = 1;
    links = new ArrayList<Link>();
    segments = new ArrayList<Segment>();
  }
  Link addLink() {
    return addLink(new PVector(random(width), random(height)));
  }
  Link addLink(PVector p) {
    Link link = new Link(p);
    links.add(link);
    return link;
  }
  Segment addSegment() {
    if(links.size() != 2) {
      return null;
    }
    return addSegment(0, 1);
  }
  Segment addSegment(int a, int b) {
    if(a >= links.size()) {
      return null;
    }
    if(b >= links.size()) {
      return null;
    }
    if(a == b) {
      return null;
    }
    Segment segment = new Segment(links.get(a), links.get(b));
    segments.add(segment);
    return segment;
  }
  boolean isValid() {
    if(links.size() < 2) {
      return false;
    }
    Set<Integer> visited = new HashSet<Integer>();
    Queue<Integer> queue = new LinkedList<Integer>();
    visited.add(0);
    queue.add(0);
    while(!queue.isEmpty()) {
      int index = queue.poll();
      Link current = links.get(index);
      for(Link adjacent : current.getNeighbors()) {
        int i = links.indexOf(adjacent);
        if(!visited.contains(i) && !queue.contains(i)) {
          queue.add(i);
        }
      }
    }
    return visited.size() == links.size();
  }
  void draw() {
    for(Segment segment : segments) {
      segment.draw();
    }
    for(Link link : links) {
      link.draw();
    }
    Rectangle b = bounds();
    if(b.x < 0) {
      for(Segment segment : segments) {
        segment.draw(new PVector(width, 0));
      }
      for(Link link : links) {
        link.draw(new PVector(width, 0));
      }
      if(b.y < 0) {
        for(Segment segment : segments) {
          segment.draw(new PVector(width, height));
        }
        for(Link link : links) {
          link.draw(new PVector(width, height));
        }
      } else if(b.y + b.h >= width) {
        for(Segment segment : segments) {
          segment.draw(new PVector(width, -height));
        }
        for(Link link : links) {
          link.draw(new PVector(width, -height));
        }
      }
    } else if(b.x + b.w >= width) {
      for(Segment segment : segments) {
        segment.draw(new PVector(-width, 0));
      }
      for(Link link : links) {
        link.draw(new PVector(-width, 0));
      }
      if(b.y < 0) {
        for(Segment segment : segments) {
          segment.draw(new PVector(-width, height));
        }
        for(Link link : links) {
          link.draw(new PVector(-width, height));
        }
      } else if(b.y + b.h >= width) {
        for(Segment segment : segments) {
          segment.draw(new PVector(-width, -height));
        }
        for(Link link : links) {
          link.draw(new PVector(-width, -height));
        }
      }
    }
    if(b.y < 0) {
      for(Segment segment : segments) {
        segment.draw(new PVector(0, height));
      }
      for(Link link : links) {
        link.draw(new PVector(0, height));
      }
    } else if(b.y + b.h >= width) {
      for(Segment segment : segments) {
        segment.draw(new PVector(0, -height));
      }
      for(Link link : links) {
        link.draw(new PVector(0, -height));
      }
    }
  }
  void update() {
    for(Link link : links) {
      link.updatePosition(delta);
    }
    for(Segment segment : segments) {
      segment.constrainPosition();
    }
    for(Link link : links) {
      link.updateVelocity(field.force(link.p), delta);
    }
    for(Segment segment : segments) {
      segment.constrainVelocity();
    }
    for(Link link : links) {
      link.update();
    }
    Rectangle b = bounds();
    if(!b.intersects(new Rectangle(0, 0, width, height))) {
      while(b.x + b.w < 0) {
        for(Link link : links) {
          link.p.x = link.p.x + width;
        }
        b = bounds();
      }
      while(b.x >= width) {
        for(Link link : links) {
          link.p.x = link.p.x - width;
        }
        b = bounds();
      }
      while(b.y + b.h < 0) {
        for(Link link : links) {
          link.p.y = link.p.y + height;
        }
        b = bounds();
      }
      while(b.y >= height) {
        for(Link link : links) {
          link.p.y = link.p.y - height;
        }
        b = bounds();
      }
    }
  }
  Rectangle bounds() {
    Rectangle b = null;
    for(Segment segment : segments) {
      b = b == null ? segment.bounds() : b.container(segment.bounds());
    }
    return b;
  }
}
