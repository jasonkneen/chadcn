import { createApp, h, type Component } from 'vue';
import { useEffect, useRef } from 'react';

type VueMountProps = {
  component: Component;
  props?: Record<string, unknown>;
  children?: string;
};

/** Mounts the original Vue SFC into a disposable React preview host. */
export function VueMount({ component, props, children }: VueMountProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!host.current) return;
    const app = createApp({
      render: () => h(component, props ?? {}, children ? { default: () => children } : undefined),
    });
    app.mount(host.current);
    return () => app.unmount();
  }, [component, children, props]);

  return <div ref={host} />;
}
