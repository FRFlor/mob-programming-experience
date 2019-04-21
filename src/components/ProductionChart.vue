<script>
    //Importing Bar class from the vue-chartjs wrapper
    import { Bar } from 'vue-chartjs'
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
                default: () => Array.from({length: 20}, (_, i) => 100 - 5*i),
            }
        },
        data () {
            return {
                datacollection: {
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
                            data: this.y
                        }
                    ]
                },
                //Chart.js options that controls the appearance of the chart
                options: {
                    title: {
                        display: true,
                        text: 'Production distribution'
                    },
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Probability %'
                            },
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: true
                            }
                        }],
                        xAxes: [ {
                            scaleLabel: {
                                display: true,
                                labelString: 'Production Total'
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            }
        },
        mounted () {
            //renderChart function renders the chart with the datacollection and options object.
            this.renderChart(this.datacollection, this.options)
        }
    }
</script>