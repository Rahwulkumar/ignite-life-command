# ignite-life-command

## Knowledge Graph (RAG)

A graphify knowledge graph of this codebase lives at `F:\ignite-life-command\graphify-out\`.

**Before answering questions about architecture, dependencies, or where things live — check the graph first:**

- `graphify-out/graph.json` — full node/edge graph (689 nodes, 483 edges across 291 source files)
- `graphify-out/GRAPH_REPORT.md` — god nodes, community map, audit trail

### How to query it

```python
import json, networkx as nx
from networkx.readwrite import json_graph
from pathlib import Path

G = json_graph.node_link_graph(
    json.loads(Path('graphify-out/graph.json').read_text()),
    edges='links'
)
```

Then use BFS/DFS or `nx.shortest_path(G, src, tgt)` to trace relationships.

### Key facts from the graph

- **God node:** `cloneLayout()` — 10 edges, the most connected abstraction in the codebase
- **Largest concern from latest run:** large low-cohesion clusters still exist and should be split gradually
- **254 communities** detected across frontend + backend source
- **Excluded from graph:** `src/components/ui/` (shadcn boilerplate), videos, images, docs

### When to use this

- "Where is X defined?" → search node labels in graph.json
- "What depends on Y?" → BFS from Y's node
- "How does A connect to B?" → `nx.shortest_path(G, A, B)`
- "What are the core abstractions?" → see God Nodes in GRAPH_REPORT.md

### Keeping it fresh

Run `graphify update .` after significant code changes to incrementally re-extract changed code files.

Claude integration is configured in `.claude/settings.json` via a `PreToolUse` hook so graph context is surfaced before broad file searching.

## graphify

This project has a graphify knowledge graph at graphify-out/.

Rules:
- Before answering architecture or codebase questions, read graphify-out/GRAPH_REPORT.md for god nodes and community structure
- If graphify-out/wiki/index.md exists, navigate it instead of reading raw files
- After modifying code files in this session, run `python3 -c "from graphify.watch import _rebuild_code; from pathlib import Path; _rebuild_code(Path('.'))"` to keep the graph current
