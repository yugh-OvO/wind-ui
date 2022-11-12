<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card
      class="general-card"
      :header-style="{ paddingBottom: 0 }"
      :body-style="{
        paddingTop: '20px',
      }"
      title="访问统计"
    >
      <Chart height="370px" :option="chartOption" />
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { graphic } from 'echarts';
  import useLoading from '@/hooks/loading';
  import { queryContentData } from '@/api/dashboard';
  import useChartOption from '@/hooks/chart-option';
  import { ToolTipFormatterParams } from '@/types/echarts';
  import { AnyObject } from '@/types/global';

  const tooltipItemsHtmlString = (items: ToolTipFormatterParams[]) => {
    return items
      .map(
        (el) => `<div class="content-panel">
        <p>
          <span style="background-color: ${el.color}" class="tooltip-item-icon"></span>
          <span>${el.seriesName}</span>
        </p>
        <span class="tooltip-value">
        ${el.value}
        </span>
      </div>`
      )
      .join('');
  };
  function graphicFactory(side: AnyObject) {
    return {
      type: 'text',
      bottom: '8',
      ...side,
      style: {
        text: '',
        textAlign: 'center',
        fill: '#4E5969',
        fontSize: 12,
      },
    };
  }
  const { loading, setLoading } = useLoading(true);
  const xData = ref<string[]>([]);
  const pvData = ref<number[]>([]);
  const visitorData = ref<number[]>([]);
  const ipData = ref<number[]>([]);
  const graphicElements = ref([
    graphicFactory({ left: '2.6%' }),
    graphicFactory({ right: 0 }),
  ]);
  const { chartOption } = useChartOption((isDark) => {
    return {
      grid: {
        left: '40',
        right: 0,
        top: '20',
        bottom: '100',
      },
      legend: {
        bottom: 0,
        icon: 'circle',
        textStyle: {
          color: '#4E5969',
        },
      },
      xAxis: {
        type: 'category',
        data: xData.value,
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: isDark ? '#3f3f3f' : '#A9AEB8',
          },
        },
        axisTick: {
          show: true,
          alignWithLabel: true,
          lineStyle: {
            color: '#86909C',
          },
          interval(idx: number) {
            if (idx === 0) return false;
            if (idx === xData.value.length - 1) return false;
            return true;
          },
        },
        axisLabel: {
          color: '#86909C',
          formatter(value: number, idx: number) {
            if (idx === 0) return '';
            if (idx === xData.value.length - 1) return '';
            return `${value}`;
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#86909C',
          formatter: '{value}',
        },
        splitLine: {
          lineStyle: {
            color: isDark ? '#3F3F3F' : '#E5E6EB',
          },
        },
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        formatter(params) {
          const [firstElement] = params as ToolTipFormatterParams[];
          return `<div>
            <p class="tooltip-title">${firstElement.axisValueLabel}</p>
            ${tooltipItemsHtmlString(params as ToolTipFormatterParams[])}
          </div>`;
        },
        className: 'echarts-tooltip-diy',
      },
      series: [
        {
          name: 'pv',
          data: pvData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#3D72F6' : '#246EFF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E0E3FF',
            },
          },
        },
        {
          name: 'uv',
          data: visitorData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#A079DC' : '#00B2FF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#E2F2FF',
            },
          },
        },
        {
          name: 'ip',
          data: ipData.value,
          type: 'line',
          smooth: true,
          showSymbol: false,
          color: isDark ? '#6CAAF5' : '#81E2FF',
          symbol: 'circle',
          symbolSize: 10,
          emphasis: {
            focus: 'series',
            itemStyle: {
              borderWidth: 2,
              borderColor: '#D9F6FF',
            },
          },
        },
      ],
      dataZoom: [
        {
          bottom: 40,
          type: 'slider',
          left: 40,
          right: 14,
          height: 14,
          borderColor: 'transparent',
          handleIcon:
            'image://http://p3-armor.byteimg.com/tos-cn-i-49unhts6dw/1ee5a8c6142b2bcf47d2a9f084096447.svg~tplv-49unhts6dw-image.image',
          handleSize: '20',
          handleStyle: {
            shadowColor: 'rgba(0, 0, 0, 0.2)',
            shadowBlur: 4,
          },
          brushSelect: false,
          backgroundColor: isDark ? '#313132' : '#F2F3F5',
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomOnMouseWheel: false,
        },
      ],
    };
  });
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: chartData } = await queryContentData();
      xData.value = chartData.xData;
      pvData.value = chartData.pvData;
      visitorData.value = chartData.visitorData;
      ipData.value = chartData.ipData;
    } catch (err) {
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  fetchData();
</script>

<style scoped lang="less"></style>
