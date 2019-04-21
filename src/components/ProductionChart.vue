<script>
    //Importing Bar class from the vue-chartjs wrapper
    import {Bar} from 'vue-chartjs';
    //Exporting this so it can be used in other components
    export default {
        extends: Bar,
        props: {
            x: {
                type: Array,
                required: false,
                default: () => Array.from({length: 20}, (_, i) => i),
            },
            y: {
                type: Array,
                required: false,
                default: () => Array.from({length: 20}, (_, i) => 100 - 5 * i),
            },
            title: {
                type: String,
                required: false,
                default: '',
            },

        },
        computed: {
            chartData: function() {
                return {
                    //Data to be represented on x-axis
                    labels: this.x,
                    datasets: [
                        {
                            label: 'Data One',
                            backgroundColor: '#f87979',
                            pointBackgroundColor: 'white',
                            borderWidth: 1,
                            pointBorderColor: '#249EBF',
                            //Data to be represented on y-axis
                            data: this.y,
                        },
                    ],
                };
            },
            options: function() {
                return {
                    title: {
                        display: !!this.title,
                        text: this.title,
                    },
                    scales: {
                        yAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Probability %',
                                },
                                ticks: {
                                    beginAtZero: false,
                                },
                                gridLines: {
                                    display: true,
                                },
                            }],
                        xAxes: [
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Production Total',
                                },
                                ticks: {
                                    beginAtZero: false,
                                    min: 40,
                                    max: 75,
                                },
                                gridLines: {
                                    display: false,
                                },
                            }],
                    },
                    legend: {
                        display: false,
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                };
            },
        },
        mounted() {
            //renderChart function renders the chart with the datacollection and options object.
            this.renderChart(this.chartData, this.options);
        },
        watch: {
            x: function() {
                if (this._chart) {
                    this._chart.destroy();
                }

                this.renderChart(this.chartData, this.options);
            },
            y: function() {
                if (this._chart) {
                    this._chart.destroy();
                }

                this.renderChart(this.chartData, this.options);
            },
        },
    };
</script>
