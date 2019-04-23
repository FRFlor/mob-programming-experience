import {shallowMount} from '@vue/test-utils';
import ProductionChart from '@/components/ProductionChart.vue';

describe('ProductionChart', () => {
    it('By default adjusts X Axis to start with 5 100% entries and end with 10 0% entries', () => {
        const {givenX, givenY, expectedX} = getMockdata(5, 10);

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
        const [minXBuffer, maxXBuffer] = [2, 2];
        const {givenX, givenY, expectedX} = getMockdata(minXBuffer, maxXBuffer);

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


const getMockdata = (minXBuffer: number, maxXBuffer: number) => {
    const numberOf100s: number = 10;
    const middleData: number[] = [50, 20, 10, 5, 2];
    const numberOf0s: number = 20;

    const givenY: number[] = Array.from({length: numberOf100s}, (_: any) => 100);
    givenY.push(...middleData);
    givenY.push(...Array.from({length: numberOf0s}, (_: any) => 0));
    const givenX: number[] = Array.from({length: givenY.length}, (_, i) => i);

    const expectedY: number[] = Array.from({length: minXBuffer}, (_: any) => 100);
    expectedY.push(...middleData);
    expectedY.push(...Array.from({length: maxXBuffer}, (_: any) => 0));
    const expectedX: number[] = Array.from({length: expectedY.length}, (_, i) => i + numberOf100s - minXBuffer);

    return {
        givenX,
        givenY,
        expectedX,
        expectedY,
    };
};
