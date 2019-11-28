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
  }
  void update() {
    for(Link link : links) {
      link.update(field.force(link.p), delta);
    }
    for(Link link : links) {
      link.update();
    }
    for(Segment segment : segments) {
      segment.constrain();
    }
  }
}
