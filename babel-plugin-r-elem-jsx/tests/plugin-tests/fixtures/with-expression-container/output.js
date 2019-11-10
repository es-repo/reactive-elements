elem("div");
elem("div").child(1 + 3);
elem("div").child("Hello world");
elem("div").child([1, 2, 3].reduce((acc, e) => acc + e, 0));
elem("div").child("Hello", elem("span").child("world"));
elem("div").child(Math.max(...[1, 2, 3]));