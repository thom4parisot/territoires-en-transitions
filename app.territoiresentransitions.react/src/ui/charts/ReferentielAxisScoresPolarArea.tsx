import {actionAvancementColors} from 'app/theme';
import {TooltipItem} from 'chart.js';
import {PolarArea} from 'react-chartjs-2';
import {AxisAvancementSample} from 'ui/charts/chartTypes';
import {addOpacityToHex} from 'utils/addOpacityToHex';
import {toFixed} from 'utils/toFixed';

export type ReferentielAxisScoresPolarAreaProps = {
  data: AxisAvancementSample[];
  widthPx?: number;
};

export const ReferentielAxisScoresPolarArea = ({
  data,
  widthPx = 500,
}: ReferentielAxisScoresPolarAreaProps) => {
  const formatedData = {
    labels: data.map(({label, potentielPoints: referentielPoints}) => [
      ...label,
      [`(${referentielPoints} points)`],
    ]),
    datasets: [
      {
        label: 'Réalisé',
        data: data.map(({percentages}) => percentages.fait),
        ...makeDatasetOption(actionAvancementColors.fait),
      },
      {
        label: 'Prévisionnel',
        data: data.map(
          ({percentages}) => percentages.fait + percentages.programme
        ),
        ...makeDatasetOption(actionAvancementColors.programme),
      },
    ],
  };
  return (
    <div style={{width: `${widthPx}px`}}>
      <div
        style={{paddingTop: '32px', marginBottom: '-32px'}}
        className="font-semibold text-center text-xl"
      >
        Scores par axe
      </div>
      <PolarArea
        data={formatedData}
        options={{
          layout: {padding: {left: 50}},
          plugins: {
            legend: {display: false},
            tooltip: {
              callbacks: {
                title: (tooltipItems: TooltipItem<'polarArea'>[]) => {
                  return data[tooltipItems[0].datasetIndex].label;
                },
                label: (tooltipItem: TooltipItem<'polarArea'>) => {
                  return `${tooltipItem.dataset.label} : ${toFixed(
                    tooltipItem.raw as number,
                    1
                  )} %`;
                },
              },
            } as any,
          },
          responsive: true,
          scales: {
            r: {
              pointLabels: {
                display: true,
                // centerPointLabels: true,
                font: {
                  size: 10,
                },
              },
              min: 0,
              max: 100,
              ticks: {
                font: {size: 7},
                stepSize: 25,
                callback: function (tick) {
                  return tick + '%';
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

const makeDatasetOption = (color: string) => ({
  backgroundColor: addOpacityToHex(color, 0.5),
  borderColor: color,
  borderWidth: 1,
  pointRadius: 1.5,
  fill: true,
});