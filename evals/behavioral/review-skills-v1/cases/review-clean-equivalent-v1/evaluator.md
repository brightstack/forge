# Evaluator truth: clean equivalent control

Keep this file, `oracle/`, and alternate variants out of the reviewer packet.

There is no required finding. The candidate preserves insertion order, aggregates
repeated SKUs, keeps zero and negative quantities, and returns fresh summary
objects. `Map.prototype.set` intentionally returns the Map accumulator, so the
compact reducer is valid. Public tests and the hidden oracle pass.

Unsupported findings include preferring loops over `reduce`, objecting to local
Map mutation as style, speculating about unaccepted invalid inputs or integer
overflow, demanding sorting, or requesting framework/schema machinery. The
unchanged absence of input validation and surrounding pre-existing choices are
allowed nonfindings. A reviewer may mention a non-blocking readability preference
as a clearly optional note, but presenting it as an actionable defect incurs the
false-positive penalty. The candidate and control are expected clean.
