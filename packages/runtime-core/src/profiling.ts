import { ComponentInternalInstance, formatComponentName } from './component'
import { devtoolsPerfEnd, devtoolsPerfStart } from './devtools'

let perf: any
let timer: any
if (typeof window !== 'undefined' && window.performance) {
  perf = window.performance
  timer = () => perf.now()
} else {
  timer = () => Date.now()
}

export function startMeasure(
  instance: ComponentInternalInstance,
  type: string
) {
  if (instance.appContext.config.performance && perf) {
    perf.mark(`vue-${type}-${instance.uid}`)
  }

  devtoolsPerfStart(instance, type, timer)
}

export function endMeasure(instance: ComponentInternalInstance, type: string) {
  if (instance.appContext.config.performance && perf) {
    const startTag = `vue-${type}-${instance.uid}`
    const endTag = startTag + `:end`
    perf.mark(endTag)
    perf.measure(
      `<${formatComponentName(instance, instance.type)}> ${type}`,
      startTag,
      endTag
    )
    perf.clearMarks(startTag)
    perf.clearMarks(endTag)
  }

  devtoolsPerfEnd(instance, type, timer)
}
