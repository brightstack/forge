import acceptance from '../skills/forge-verify/assets/acceptance.md' with { type: 'text' }
import bug from '../skills/forge-spec/assets/bug.md' with { type: 'text' }
import bugSpec from '../skills/forge-spec/assets/bug-spec.md' with { type: 'text' }
import buildLog from '../skills/forge-build/assets/build-log.md' with { type: 'text' }
import buildPlan from '../skills/forge-plan/assets/build-plan.md' with { type: 'text' }
import buildResult from '../skills/forge-build/assets/build-result.md' with { type: 'text' }
import concept from '../skills/forge-shared/assets/concept.md' with { type: 'text' }
import decisions from '../skills/forge-shared/assets/decisions.md' with { type: 'text' }
import design from '../skills/forge-spec/assets/design.md' with { type: 'text' }
import designSpec from '../skills/forge-spec/assets/design-spec.md' with { type: 'text' }
import index from '../skills/forge-shared/assets/index.md' with { type: 'text' }
import interfaceTemplate from '../skills/forge-shared/assets/interface.md' with { type: 'text' }
import issue from '../skills/forge-spec/assets/issue.md' with { type: 'text' }
import kbDecision from '../skills/forge-shared/assets/kb-decision.md' with { type: 'text' }
import kbIndex from '../skills/forge-shared/assets/kb-index.md' with { type: 'text' }
import kbLog from '../skills/forge-shared/assets/kb-log.md' with { type: 'text' }
import log from '../skills/forge-shared/assets/log.md' with { type: 'text' }
import plan from '../skills/forge-plan/assets/plan.md' with { type: 'text' }
import planReview from '../skills/forge-plan/assets/plan-review.md' with { type: 'text' }
import process from '../skills/forge-shared/assets/process.md' with { type: 'text' }
import product from '../skills/forge-spec/assets/product.md' with { type: 'text' }
import productSpec from '../skills/forge-spec/assets/product-spec.md' with { type: 'text' }
import review from '../skills/forge-review/assets/review.md' with { type: 'text' }
import rootIndex from '../skills/forge-shared/assets/root-index.md' with { type: 'text' }
import ship from '../skills/forge-ship/assets/ship.md' with { type: 'text' }
import simplify from '../skills/forge-simplify/assets/simplify.md' with { type: 'text' }
import specChange from '../skills/forge-spec/assets/spec-change.md' with { type: 'text' }
import specReview from '../skills/forge-spec/assets/spec-review.md' with { type: 'text' }
import standingSpec from '../skills/forge-shared/assets/standing-spec.md' with { type: 'text' }
import tech from '../skills/forge-spec/assets/tech.md' with { type: 'text' }
import technicalSpec from '../skills/forge-spec/assets/technical-spec.md' with { type: 'text' }
import visual from '../skills/forge-shared/assets/visual.md' with { type: 'text' }
import waveIndex from '../skills/forge-shared/assets/wave-index.md' with { type: 'text' }
import work from '../skills/forge-spec/assets/work.md' with { type: 'text' }
import workSpec from '../skills/forge-spec/assets/work-spec.md' with { type: 'text' }

export const TEMPLATES: Readonly<Record<string, string>> = Object.freeze({
  acceptance,
  bug,
  'bug-spec': bugSpec,
  'build-log': buildLog,
  'build-plan': buildPlan,
  'build-result': buildResult,
  concept,
  decisions,
  design,
  'design-spec': designSpec,
  index,
  interface: interfaceTemplate,
  issue,
  'kb-decision': kbDecision,
  'kb-index': kbIndex,
  'kb-log': kbLog,
  log,
  plan,
  'plan-review': planReview,
  process,
  product,
  'product-spec': productSpec,
  review,
  'root-index': rootIndex,
  ship,
  simplify,
  'spec-change': specChange,
  'spec-review': specReview,
  'standing-spec': standingSpec,
  tech,
  'technical-spec': technicalSpec,
  visual,
  'wave-index': waveIndex,
  work,
  'work-spec': workSpec,
})
