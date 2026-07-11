// The term bank. Each entry has six hints ordered from obscure to obvious, and
// also seeds the Supabase daily_terms table.

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
      'It only works on a collection that already obeys an ordering invariant.',
      'Each step discards half of the remaining candidates.',
      'Its running time grows logarithmically with the input size.',
      'You track a low and high boundary and inspect the middle element.',
      'Think of how you find a word in a physical dictionary.',
      'The classic O(log n) way to locate a value in a sorted array.',
    ],
    definition:
      'A search algorithm that finds a target in a sorted array by repeatedly halving the search interval, comparing the target to the middle element and discarding the half that cannot contain it. Runs in O(log n) time.',
  },
  {
    id: 'hash-table',
    term: 'Hash Table',
    hints: [
      'A function maps keys to positions in a backing array.',
      'Two distinct keys landing in the same slot is called a collision.',
      'Chaining and open addressing are two ways to resolve those clashes.',
      'Average lookup, insert, and delete are all constant time.',
      'Python calls it a dict; Java calls it a HashMap.',
      'A key-value store giving O(1) average access via a hash function.',
    ],
    definition:
      'A data structure that maps keys to values using a hash function to compute an index into an array of buckets. Offers average O(1) insertion, lookup, and deletion, with collision-resolution strategies like chaining or open addressing.',
  },
  {
    id: 'recursion',
    term: 'Recursion',
    hints: [
      'It relies on a base case to avoid running forever.',
      'The call stack grows with each self-referential step.',
      'Without a terminating condition it overflows the stack.',
      'A function that solves a problem by calling itself on smaller inputs.',
      'Computing a factorial or traversing a tree are textbook uses.',
      'To understand it, first understand it — a routine that invokes itself.',
    ],
    definition:
      'A technique where a function solves a problem by calling itself on smaller subproblems, converging toward a base case that stops the recursion. Each call adds a frame to the call stack.',
  },
  {
    id: 'big-o-notation',
    term: 'Big-O Notation',
    hints: [
      'It describes an asymptotic upper bound as input size approaches infinity.',
      'Constant factors and lower-order terms are dropped.',
      'It says nothing about the exact wall-clock time on real hardware.',
      'Common classes include constant, logarithmic, linear, and quadratic.',
      'Written with a capital letter and parentheses, like the cost of a loop.',
      'The notation used to describe an algorithm’s worst-case growth rate.',
    ],
    definition:
      'A mathematical notation describing the limiting behavior of an algorithm’s time or space requirements as the input grows, expressed as an asymptotic upper bound with constant factors and lower-order terms omitted (e.g., O(n), O(log n)).',
  },
  {
    id: 'linked-list',
    term: 'Linked List',
    hints: [
      'Elements need not be contiguous in memory.',
      'Each element stores a reference to its neighbor.',
      'Random access is linear, but insertion at a known spot is constant.',
      'A node holds a value plus one or two pointers.',
      'It can be singly or doubly connected, sometimes forming a ring.',
      'A chain of nodes where each points to the next.',
    ],
    definition:
      'A linear data structure in which elements (nodes) are stored non-contiguously, each holding a value and a pointer to the next node. Supports O(1) insertion/deletion at a known position but O(n) random access.',
  },
  {
    id: 'stack',
    term: 'Stack',
    hints: [
      'Access is restricted to a single end.',
      'The function call mechanism itself is built on one.',
      'Its ordering discipline is last-in, first-out.',
      'The two core operations are push and pop.',
      'Think of a spring-loaded pile of cafeteria trays.',
      'A LIFO collection where the most recent item is removed first.',
    ],
    definition:
      'An abstract data type with last-in-first-out (LIFO) ordering, supporting push (add to top) and pop (remove from top). Underlies function-call management, expression evaluation, and backtracking.',
  },
  {
    id: 'queue',
    term: 'Queue',
    hints: [
      'Insertion and removal happen at opposite ends.',
      'It preserves the order in which items arrived.',
      'Its ordering discipline is first-in, first-out.',
      'The core operations are enqueue and dequeue.',
      'Think of a line of people waiting for a teller.',
      'A FIFO collection where the oldest item is served first.',
    ],
    definition:
      'An abstract data type with first-in-first-out (FIFO) ordering, supporting enqueue (add to back) and dequeue (remove from front). Common in scheduling, buffering, and breadth-first traversal.',
  },
  {
    id: 'binary-search-tree',
    term: 'Binary Search Tree',
    hints: [
      'It maintains an ordering invariant between parent and children.',
      'Every node has at most two children.',
      'An in-order traversal visits the values in sorted sequence.',
      'Left subtree keys are smaller; right subtree keys are larger.',
      'It degrades to a linked list when inserted in sorted order.',
      'A tree giving O(log n) search when balanced, thanks to its ordering rule.',
    ],
    definition:
      'A binary tree where each node’s left subtree contains only smaller keys and its right subtree only larger keys. Enables O(log n) search, insert, and delete when balanced; degrades to O(n) when skewed.',
  },
  {
    id: 'depth-first-search',
    term: 'Depth-First Search',
    hints: [
      'It commits fully to one path before considering alternatives.',
      'A stack — explicit or via recursion — drives its ordering.',
      'It can get lost in an infinite branch without a visited set.',
      'Pre-order, in-order, and post-order are variants of it on trees.',
      'It backtracks only after hitting a dead end.',
      'A graph traversal that goes as deep as possible before retreating.',
    ],
    definition:
      'A graph and tree traversal that explores as far as possible along each branch before backtracking, typically implemented with recursion or an explicit stack. Used for topological sorting, cycle detection, and connectivity.',
  },
  {
    id: 'breadth-first-search',
    term: 'Breadth-First Search',
    hints: [
      'It explores in concentric layers outward from a source.',
      'A queue governs the order in which nodes are visited.',
      'On an unweighted graph it yields shortest paths from the start.',
      'All neighbors at the current distance are visited before going deeper.',
      'It is the natural counterpart to going deep first.',
      'A level-by-level graph traversal built on a FIFO queue.',
    ],
    definition:
      'A graph traversal that visits all nodes at the current distance from the source before moving outward, implemented with a queue. Finds shortest paths in unweighted graphs and explores the graph level by level.',
  },
  {
    id: 'dynamic-programming',
    term: 'Dynamic Programming',
    hints: [
      'It applies when subproblems overlap and solutions compose optimally.',
      'Results are stored so each subproblem is solved only once.',
      'Top-down memoization and bottom-up tabulation are its two styles.',
      'The knapsack and longest-common-subsequence problems are classics.',
      'Its confusing name has nothing to do with writing code that changes.',
      'Solving complex problems by combining answers to overlapping subproblems.',
    ],
    definition:
      'An optimization technique that solves complex problems by breaking them into overlapping subproblems, solving each once, and storing results (via memoization or tabulation) to avoid redundant work.',
  },
  {
    id: 'bloom-filter',
    term: 'Bloom Filter',
    hints: [
      'It answers set-membership questions using only a bit array.',
      'Multiple independent hash functions flip several bits per element.',
      'It can report a false positive but never a false negative.',
      'You cannot remove an element from the basic version.',
      'It trades perfect accuracy for a tiny, fixed memory footprint.',
      'A probabilistic structure that tells you if an item is possibly present.',
    ],
    definition:
      'A space-efficient probabilistic data structure that tests set membership using a bit array and several hash functions. It can yield false positives but never false negatives, trading exactness for memory.',
  },
  {
    id: 'dijkstra',
    term: "Dijkstra's Algorithm",
    hints: [
      'It requires all edge weights to be non-negative.',
      'A priority queue repeatedly extracts the closest unsettled node.',
      'Each node’s tentative distance is relaxed as shorter paths appear.',
      'It computes shortest paths from a single source to all others.',
      'It is named after a famously opinionated Dutch computer scientist.',
      'The classic greedy shortest-path algorithm for weighted graphs.',
    ],
    definition:
      'A greedy algorithm that computes the shortest paths from a single source to all other vertices in a graph with non-negative edge weights, using a priority queue to always expand the nearest unsettled node.',
  },
  {
    id: 'merge-sort',
    term: 'Merge Sort',
    hints: [
      'It follows a divide-and-conquer strategy.',
      'The input is split in half until single elements remain.',
      'Its guaranteed running time is O(n log n) in every case.',
      'The combine step interleaves two already-sorted runs.',
      'It is stable but typically needs extra memory proportional to n.',
      'A sort that recursively splits, then merges sorted halves back together.',
    ],
    definition:
      'A divide-and-conquer sorting algorithm that recursively splits the array in half, sorts each half, and merges the sorted halves. Runs in O(n log n) time in all cases and is stable, usually at the cost of O(n) extra space.',
  },
  {
    id: 'quicksort',
    term: 'Quicksort',
    hints: [
      'It partitions around a chosen element each step.',
      'Elements are rearranged so smaller ones precede larger ones.',
      'Its worst case is quadratic, but the average is O(n log n).',
      'A poor pivot on already-sorted data triggers that worst case.',
      'It is typically done in place with very little extra memory.',
      'A divide-and-conquer sort built around partitioning by a pivot.',
    ],
    definition:
      'A divide-and-conquer sorting algorithm that picks a pivot, partitions elements into those less than and greater than it, and recursively sorts the partitions. Averages O(n log n) and sorts in place, but degrades to O(n²) with poor pivots.',
  },
  {
    id: 'heap',
    term: 'Heap',
    hints: [
      'A parent always dominates its children under some ordering.',
      'It is usually stored implicitly in a flat array, not with pointers.',
      'The extreme element always sits at the root.',
      'Insertion and extraction both cost O(log n).',
      'It is the structure behind an efficient priority queue.',
      'A complete binary tree maintaining the min- or max- ordering property.',
    ],
    definition:
      'A complete binary tree satisfying the heap property—each parent is ordered relative to its children (min-heap or max-heap). Typically array-backed, it supports O(log n) insertion and extraction and underlies priority queues and heapsort.',
  },
  {
    id: 'graph',
    term: 'Graph',
    hints: [
      'It is defined by a set of entities and the connections among them.',
      'Those connections may carry a direction or a weight.',
      'It can be represented as an adjacency list or an adjacency matrix.',
      'A cycle is a path that returns to where it started.',
      'Social networks and road maps are naturally modeled by it.',
      'A structure of vertices joined by edges.',
    ],
    definition:
      'A data structure consisting of a set of vertices (nodes) connected by edges, which may be directed or undirected and weighted or unweighted. Represented via adjacency lists or matrices, it models networks, maps, and dependencies.',
  },
  {
    id: 'trie',
    term: 'Trie',
    hints: [
      'A node’s position, not its stored value, encodes information.',
      'Common prefixes are shared along a single path from the root.',
      'Lookup cost depends on key length, not the number of keys.',
      'It powers autocomplete and prefix-matching features.',
      'Its name comes from the middle of the word "retrieval".',
      'A tree keyed by character, where each path spells a stored string.',
    ],
    definition:
      'A tree-shaped data structure for storing strings where each node represents a character and each root-to-node path spells a prefix. Enables fast prefix queries and autocomplete, with lookup time proportional to key length.',
  },
  {
    id: 'memoization',
    term: 'Memoization',
    hints: [
      'It is an optimization that exchanges memory for speed.',
      'A cache is keyed by the arguments a function was called with.',
      'A repeated call with the same inputs returns the stored result.',
      'It is the top-down flavor of a broader optimization technique.',
      'Wrapping a slow recursive Fibonacci with it makes it fast.',
      'Caching a function’s results so identical calls skip recomputation.',
    ],
    definition:
      'An optimization that caches the results of expensive function calls keyed by their arguments, returning the cached value when the same inputs recur. It is the top-down form of dynamic programming.',
  },
  {
    id: 'mutex',
    term: 'Mutex',
    hints: [
      'It enforces that a critical section runs one thread at a time.',
      'Acquiring it may block a thread until it is released.',
      'Forgetting to release it can freeze the whole program.',
      'Its name is a contraction of "mutual exclusion".',
      'Only the thread that locked it should unlock it.',
      'A lock that guarantees exclusive access to a shared resource.',
    ],
    definition:
      'A synchronization primitive (short for "mutual exclusion") that ensures only one thread accesses a shared resource or critical section at a time. Threads acquire the lock, do their work, and release it; others block until it is free.',
  },
  {
    id: 'deadlock',
    term: 'Deadlock',
    hints: [
      'It arises among two or more parties that cannot proceed.',
      'Each party holds a resource the other one needs.',
      'It requires a circular wait among the participants.',
      'Coffman identified four conditions that must all hold for it.',
      'Two threads each grabbing a lock the other wants triggers it.',
      'A standstill where processes block forever waiting on each other.',
    ],
    definition:
      'A state in which two or more processes are each blocked forever, waiting on resources held by the others. It requires four simultaneous conditions: mutual exclusion, hold-and-wait, no preemption, and circular wait.',
  },
  {
    id: 'cache',
    term: 'Cache',
    hints: [
      'It exploits the observation that recent data is often reused soon.',
      'A hit is served fast; a miss falls through to slower storage.',
      'Eviction policies like LRU decide what to discard when it is full.',
      'CPUs use several layered levels of it near the core.',
      'Invalidating it is famously one of the two hard problems.',
      'A small, fast store holding copies of frequently accessed data.',
    ],
    definition:
      'A small, fast storage layer that keeps copies of frequently or recently used data so future requests are served quickly. Governed by eviction policies (e.g., LRU) when full; central to CPU, disk, and web performance.',
  },
  {
    id: 'pointer',
    term: 'Pointer',
    hints: [
      'Its value is itself a location rather than the data of interest.',
      'Dereferencing it reaches through to the value it designates.',
      'A null or dangling one is a classic source of crashes.',
      'Arithmetic on it moves by the size of the type it targets.',
      'C and C++ expose it directly; Java hides it behind references.',
      'A variable that stores the memory address of another value.',
    ],
    definition:
      'A variable whose value is the memory address of another value. Dereferencing a pointer accesses the data it points to. Powerful for building dynamic structures, but null or dangling pointers are a common bug source.',
  },
  {
    id: 'regular-expression',
    term: 'Regular Expression',
    hints: [
      'It denotes a pattern equivalent in power to a finite automaton.',
      'Engines compile it into a state machine to scan text.',
      'Quantifiers and character classes describe what to match.',
      'Anchors pin a match to the start or end of a line.',
      'Overusing it to parse HTML is a running programmer joke.',
      'A compact syntax for describing text-matching patterns.',
    ],
    definition:
      'A sequence of characters defining a search pattern, used to match, extract, or replace text. Equivalent in expressive power to finite automata, it combines literals, character classes, quantifiers, and anchors.',
  },
];
