import { VueMount } from './vue/mount';
import Loader from '../../../ai-elements-vue/packages/elements/src/loader/Loader.vue';
import Shimmer from '../../../ai-elements-vue/packages/elements/src/shimmer/Shimmer.vue';

export function VueLoaderDemo() {
  return <div className="demo-form"><VueMount component={Loader} props={{ size: 22 }} /><span>Preparing response</span></div>;
}

export function VueShimmerDemo() {
  return <VueMount component={Shimmer} props={{ as: 'span', duration: 1.5 }}>Drafting a thoughtful answer...</VueMount>;
}
