// The term bank. Each entry has six hints ordered from vague to obvious — hint 1
// is a subtle property only someone who knows the concept would recognize, and
// hint 6 is nearly explicit. This also seeds the Supabase daily_terms table.

export interface SeedTerm {
  id: string;
  term: string;
  hints: string[];
  definition: string;
}

export const termBank: SeedTerm[] = [
  {
    id: 'binary-search',
    term: 'Binary Search',
    hints: [
      'Its correctness rests on a precondition people forget to check.',
      'A slightly wrong midpoint can overflow or loop forever on huge inputs.',
      'Each comparison lets you throw away half of what remains.',
      'It narrows a range by tracking a low and high bound and probing the middle.',
      'It runs in logarithmic time, but only on data that is already ordered.',
      'It finds a value in a sorted list by repeatedly splitting it in half.',
    ],
    definition:
      'A search algorithm that finds a target in a sorted array by repeatedly halving the search interval, comparing the target to the middle element and discarding the half that cannot contain it. Runs in O(log n) time.',
  },
  {
    id: 'hash-table',
    term: 'Hash Table',
    hints: [
      'Its worst case is dreadful, yet in practice you almost never hit it.',
      'Growing it means rebuilding the whole thing from scratch.',
      'Two different keys can demand the same slot, and you need a plan for that.',
      'A function turns each key into an index into a backing array.',
      'It gives average constant-time lookup, insertion, and deletion by key.',
      'It is the key-value structure Python calls a dict and Java a HashMap.',
    ],
    definition:
      'A data structure that maps keys to values using a hash function to compute an index into an array of buckets. Offers average O(1) insertion, lookup, and deletion, with collision-resolution strategies like chaining or open addressing.',
  },
  {
    id: 'recursion',
    term: 'Recursion',
    hints: [
      'Done wrong, it is indistinguishable from a loop that eventually crashes.',
      'Every step quietly consumes a little more of a resource you do not manage.',
      'It leans on a terminating condition to know when to stop.',
      'A function reduces a problem by invoking itself on something smaller.',
      'Traversing a tree or computing a factorial are its textbook examples.',
      'It is what happens when a function calls itself.',
    ],
    definition:
      'A technique where a function solves a problem by calling itself on smaller subproblems, converging toward a base case that stops the recursion. Each call adds a frame to the call stack.',
  },
  {
    id: 'big-o-notation',
    term: 'Big-O Notation',
    hints: [
      'It deliberately ignores the constants that decide real-world speed.',
      'By its measure, a sluggish algorithm and a fast one can look identical.',
      'It cares only about behavior as the input grows toward infinity.',
      'Coefficients and lower-order terms drop; only the dominant growth remains.',
      'It sorts algorithms into constant, logarithmic, linear, quadratic, and so on.',
      'It is the notation, written with a capital O and parentheses, for growth rate.',
    ],
    definition:
      'A mathematical notation describing the limiting behavior of an algorithm’s time or space requirements as the input grows, expressed as an asymptotic upper bound with constant factors and lower-order terms omitted (e.g., O(n), O(log n)).',
  },
  {
    id: 'linked-list',
    term: 'Linked List',
    hints: [
      'Reaching its tenth element costs ten times as much as reaching its first.',
      'Its elements can sit anywhere in memory, not laid out side by side.',
      'Inserting in the middle is cheap; jumping to the middle is not.',
      'Each element holds a value plus a reference to the next one.',
      'It comes in singly, doubly, and circular varieties.',
      'It is a chain of nodes where every node points to the next.',
    ],
    definition:
      'A linear data structure in which elements (nodes) are stored non-contiguously, each holding a value and a pointer to the next node. Supports O(1) insertion/deletion at a known position but O(n) random access.',
  },
  {
    id: 'stack',
    term: 'Stack',
    hints: [
      'The thing you put in most recently is the only thing you can reach.',
      'The mechanism that lets functions call other functions is built on one.',
      'Undo history and backtracking rely naturally on its ordering.',
      'Its two operations, push and pop, both act at the same end.',
      'Its discipline is last-in, first-out.',
      'It works like a pile of trays where you always take from the top.',
    ],
    definition:
      'An abstract data type with last-in-first-out (LIFO) ordering, supporting push (add to top) and pop (remove from top). Underlies function-call management, expression evaluation, and backtracking.',
  },
  {
    id: 'queue',
    term: 'Queue',
    hints: [
      'Fairness is its defining virtue: nothing jumps ahead of what came before.',
      'You add at one end and remove from the other.',
      'Task schedulers and print spoolers are built around it.',
      'Its operations are enqueue and dequeue.',
      'Its discipline is first-in, first-out.',
      'It works like a line of people waiting their turn.',
    ],
    definition:
      'An abstract data type with first-in-first-out (FIFO) ordering, supporting enqueue (add to back) and dequeue (remove from front). Common in scheduling, buffering, and breadth-first traversal.',
  },
  {
    id: 'binary-search-tree',
    term: 'Binary Search Tree',
    hints: [
      'Feed it already-sorted input and it quietly degenerates into a line.',
      'Reading it in one particular order magically yields sorted output.',
      'At every node, everything smaller goes one way and everything larger the other.',
      'Each node has at most two children, arranged by an ordering rule.',
      'Balanced, it searches, inserts, and deletes in logarithmic time.',
      'It is a binary tree that keeps its keys ordered left-to-right.',
    ],
    definition:
      'A binary tree where each node’s left subtree contains only smaller keys and its right subtree only larger keys. Enables O(log n) search, insert, and delete when balanced; degrades to O(n) when skewed.',
  },
  {
    id: 'depth-first-search',
    term: 'Depth-First Search',
    hints: [
      'Skip one small bookkeeping set and it can wander a loop forever.',
      'It commits completely to one path before considering any alternative.',
      'It backs up only once it hits a dead end.',
      'A stack — or the call stack via recursion — drives the order it explores.',
      'Cycle detection and topological sort are built on it.',
      'It is the graph traversal that goes as deep as possible before backtracking.',
    ],
    definition:
      'A graph and tree traversal that explores as far as possible along each branch before backtracking, typically implemented with recursion or an explicit stack. Used for topological sorting, cycle detection, and connectivity.',
  },
  {
    id: 'breadth-first-search',
    term: 'Breadth-First Search',
    hints: [
      'On the right kind of graph it hands you shortest paths as a free side effect.',
      'It fans outward in rings of equal distance from where it started.',
      'It fully finishes one layer before touching the next.',
      'A queue decides which node it visits next.',
      'It is the natural counterpart to going as deep as possible first.',
      'It is the graph traversal that explores level by level.',
    ],
    definition:
      'A graph traversal that visits all nodes at the current distance from the source before moving outward, implemented with a queue. Finds shortest paths in unweighted graphs and explores the graph level by level.',
  },
  {
    id: 'dynamic-programming',
    term: 'Dynamic Programming',
    hints: [
      'It only pays off when the same small subproblem keeps showing up again.',
      'Its confusing name has nothing to do with code that changes at runtime.',
      'The trick is to solve each piece once and remember the answer.',
      'It comes in a top-down memoized flavor and a bottom-up tabulated one.',
      'Knapsack and longest-common-subsequence are its classic problems.',
      'It solves a problem by combining stored answers to overlapping subproblems.',
    ],
    definition:
      'An optimization technique that solves complex problems by breaking them into overlapping subproblems, solving each once, and storing results (via memoization or tabulation) to avoid redundant work.',
  },
  {
    id: 'bloom-filter',
    term: 'Bloom Filter',
    hints: [
      'It may claim to have seen something it never did, but never the reverse.',
      'You can add to it, but you cannot remove from it.',
      'It answers "have I seen this?" using nothing but a row of bits.',
      'Several hash functions each flip a few bits per element.',
      'It trades exactness for a tiny, fixed amount of memory.',
      'It is a probabilistic set: an item is possibly present or definitely absent.',
    ],
    definition:
      'A space-efficient probabilistic data structure that tests set membership using a bit array and several hash functions. It can yield false positives but never false negatives, trading exactness for memory.',
  },
  {
    id: 'dijkstra',
    term: "Dijkstra's Algorithm",
    hints: [
      'Introduce a single negative weight and its guarantees fall apart.',
      'It always expands whichever unfinished node is currently closest.',
      'It keeps improving tentative distances as shorter routes appear.',
      'A priority queue is what makes it efficient.',
      'It finds shortest paths from one source to every node in a weighted graph.',
      'It is the classic greedy shortest-path algorithm, named after a Dutch scientist.',
    ],
    definition:
      'A greedy algorithm that computes the shortest paths from a single source to all other vertices in a graph with non-negative edge weights, using a priority queue to always expand the nearest unsettled node.',
  },
  {
    id: 'merge-sort',
    term: 'Merge Sort',
    hints: [
      'Its running time is the same whether the input is random, sorted, or reversed.',
      'It typically needs extra memory proportional to the input size.',
      'It preserves the relative order of equal elements.',
      'It splits the input in half over and over, then stitches the pieces together.',
      'The combining step interleaves two already-sorted runs.',
      'It is the divide-and-conquer sort that recursively splits, then merges.',
    ],
    definition:
      'A divide-and-conquer sorting algorithm that recursively splits the array in half, sorts each half, and merges the sorted halves. Runs in O(n log n) time in all cases and is stable, usually at the cost of O(n) extra space.',
  },
  {
    id: 'quicksort',
    term: 'Quicksort',
    hints: [
      'One unlucky choice on already-sorted data drags it to its worst case.',
      'Despite a quadratic worst case, it is often the fastest in practice.',
      'It rearranges elements around a chosen value each step.',
      'It usually sorts in place, needing almost no extra memory.',
      'Everything smaller than the pivot goes before it, everything larger after.',
      'It is the divide-and-conquer sort built around partitioning by a pivot.',
    ],
    definition:
      'A divide-and-conquer sorting algorithm that picks a pivot, partitions elements into those less than and greater than it, and recursively sorts the partitions. Averages O(n log n) and sorts in place, but degrades to O(n²) with poor pivots.',
  },
  {
    id: 'heap',
    term: 'Heap',
    hints: [
      'Finding its most extreme element is instant; finding any other is not.',
      'It is almost always stored as a flat array, with no pointers at all.',
      'Every parent dominates its children under one consistent ordering.',
      'Inserting and removing the top each cost logarithmic time.',
      'It is the structure that makes a priority queue efficient.',
      'It is a complete binary tree kept in min- or max- order.',
    ],
    definition:
      'A complete binary tree satisfying the heap property—each parent is ordered relative to its children (min-heap or max-heap). Typically array-backed, it supports O(log n) insertion and extraction and underlies priority queues and heapsort.',
  },
  {
    id: 'graph',
    term: 'Graph',
    hints: [
      'Direction, weight, and cycles are all optional flavors it can take on.',
      'You can store it as a list of neighbors or as a grid of connections.',
      'A path that loops back to where it began is called a cycle.',
      'It is made of entities and the connections between them.',
      'Social networks and road maps are naturally modeled by it.',
      'It is a set of vertices joined by edges.',
    ],
    definition:
      'A data structure consisting of a set of vertices (nodes) connected by edges, which may be directed or undirected and weighted or unweighted. Represented via adjacency lists or matrices, it models networks, maps, and dependencies.',
  },
  {
    id: 'trie',
    term: 'Trie',
    hints: [
      'What matters is where a node sits, not what value it stores.',
      'Two keys that share a prefix also share a path from the root.',
      'Lookup time depends on the key length, not how many keys exist.',
      'It powers autocomplete and prefix search.',
      'Its odd name comes from the middle of the word "retrieval".',
      'It is a tree keyed by character, where each path spells out a string.',
    ],
    definition:
      'A tree-shaped data structure for storing strings where each node represents a character and each root-to-node path spells a prefix. Enables fast prefix queries and autocomplete, with lookup time proportional to key length.',
  },
  {
    id: 'memoization',
    term: 'Memoization',
    hints: [
      'It spends memory to buy back time.',
      'Call it twice with identical arguments and the second call does no work.',
      'It stashes results in a cache keyed by the function’s inputs.',
      'It is the top-down face of a broader optimization technique.',
      'Wrapping a naive recursive Fibonacci in it makes it fast.',
      'It is caching a function’s return values so repeat calls skip the work.',
    ],
    definition:
      'An optimization that caches the results of expensive function calls keyed by their arguments, returning the cached value when the same inputs recur. It is the top-down form of dynamic programming.',
  },
  {
    id: 'mutex',
    term: 'Mutex',
    hints: [
      'Whoever locks it is the only one who should unlock it.',
      'Forget to release it and the whole program can seize up.',
      'It forces a critical section to run one thread at a time.',
      'A thread that cannot acquire it simply waits.',
      'Its name is a contraction of the two words describing what it enforces.',
      'It is a lock granting one thread exclusive access to a shared resource.',
    ],
    definition:
      'A synchronization primitive (short for "mutual exclusion") that ensures only one thread accesses a shared resource or critical section at a time. Threads acquire the lock, do their work, and release it; others block until it is free.',
  },
  {
    id: 'deadlock',
    term: 'Deadlock',
    hints: [
      'Four specific conditions must all hold at once; break any one and it cannot occur.',
      'Everyone involved is waiting, and no one can ever move forward.',
      'Each party holds exactly what another party is waiting for.',
      'A circular chain of waiting sits at its heart.',
      'Two threads each grabbing a lock the other already holds triggers it.',
      'It is a permanent standstill where processes block each other forever.',
    ],
    definition:
      'A state in which two or more processes are each blocked forever, waiting on resources held by the others. It requires four simultaneous conditions: mutual exclusion, hold-and-wait, no preemption, and circular wait.',
  },
  {
    id: 'cache',
    term: 'Cache',
    hints: [
      'Knowing when to throw things out of it is famously one of the hard problems.',
      'It bets that whatever was just used will be wanted again soon.',
      'A hit is fast; a miss falls through to something slower.',
      'When full, a policy like least-recently-used decides what to evict.',
      'CPUs stack several levels of it close to the core.',
      'It is a small, fast store holding copies of frequently used data.',
    ],
    definition:
      'A small, fast storage layer that keeps copies of frequently or recently used data so future requests are served quickly. Governed by eviction policies (e.g., LRU) when full; central to CPU, disk, and web performance.',
  },
  {
    id: 'pointer',
    term: 'Pointer',
    hints: [
      'Its value is not the data you care about, but where to find that data.',
      'Leave one dangling or null and you get a classic crash.',
      'Following it reaches through to the value it refers to.',
      'Arithmetic on it moves in units of the type it targets.',
      'C exposes it directly; Java hides it behind references.',
      'It is a variable that stores a memory address.',
    ],
    definition:
      'A variable whose value is the memory address of another value. Dereferencing a pointer accesses the data it points to. Powerful for building dynamic structures, but null or dangling pointers are a common bug source.',
  },
  {
    id: 'regular-expression',
    term: 'Regular Expression',
    hints: [
      'It is no more powerful than a finite automaton, and provably cannot parse everything.',
      'Trying to use it to parse HTML is a running programmer joke.',
      'An engine compiles it into a state machine to scan text.',
      'Quantifiers, character classes, and anchors are its building blocks.',
      'It matches, extracts, and replaces text by pattern.',
      'It is the compact pattern syntax usually shortened to "regex".',
    ],
    definition:
      'A sequence of characters defining a search pattern, used to match, extract, or replace text. Equivalent in expressive power to finite automata, it combines literals, character classes, quantifiers, and anchors.',
  },
];
