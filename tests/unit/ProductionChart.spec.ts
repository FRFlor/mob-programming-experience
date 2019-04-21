import {shallowMount} from '@vue/test-utils';
import ProductionChart from '@/components/ProductionChart.vue';

describe('ProductionChart', () => {
    it('By default adjusts X Axis to start with 5 100% entries and end with 10 0% entries', () => {
        const givenY: number[] = Array.from({length: 10}, _ => 100);
        givenY.push(50, 20, 10, 5, 2);
        givenY.push(...Array.from({length: 20}, _ => 0));

        const givenX: number[] = Array.from({length: givenY.length}, (_, i) => i);

        const expectedY: number[] = Array.from({length: 5}, _ => 100);
        expectedY.push(50, 20, 10, 5, 2);
        expectedY.push(...Array.from({length: 10}, _ => 0));

        const expectedX: number[] = Array.from({length: expectedY.length}, (_, i) => i + 5);

        const wrapper = shallowMount(ProductionChart, {
            propsData: {
                noRendering: true,
                x: givenX,
                y: givenY,
            },
        });

        // @ts-ignore
        const options: any = wrapper.vm.options;
        expect(options.scales.xAxes[0].ticks.min).toBe(expectedX[0]);
        expect(options.scales.xAxes[0].ticks.max).toBe(expectedX[expectedX.length - 1]);
    });
    it('Adjusts the X Axis buffer based on given prop:' +
        ' start with minXBuffer 100% entries and end with maxXBuffer 0% entries', () => {
        const numberOf10s: number = 10;
        const givenY: number[] = Array.from({length: numberOf10s}, _ => 100);
        givenY.push(50, 20, 10, 5, 2);
        givenY.push(...Array.from({length: 20}, _ => 0));
        const givenX: number[] = Array.from({length: givenY.length}, (_, i) => i);

        const minXBuffer: number = 2;
        const maxXBuffer: number = 2;

        const expectedY: number[] = Array.from({length: minXBuffer}, _ => 100);
        expectedY.push(50, 20, 10, 5, 2);
        expectedY.push(...Array.from({length: maxXBuffer}, _ => 0));
        const expectedX: number[] = Array.from({length: expectedY.length}, (_, i) => i + numberOf10s - minXBuffer);

        const wrapper = shallowMount(ProductionChart, {
            propsData: {
                noRendering: true,
                minXBuffer,
                maxXBuffer,
                x: givenX,
                y: givenY,
            },
        });

        // @ts-ignore
        const options: any = wrapper.vm.options;
        expect(options.scales.xAxes[0].ticks.min).toBe(expectedX[0]);
        expect(options.scales.xAxes[0].ticks.max).toBe(expectedX[expectedX.length - 1]);
    });
});
