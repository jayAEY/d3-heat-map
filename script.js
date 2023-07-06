document.addEventListener('DOMContentLoaded', () => {

let m = 50,
    w = 860,
    h = 520,
    barWidth,
    barHeight

const colors = ['#182c9a','#629ddd','#bd672e','#a10d0a']
      
d3.json('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json')
    .then((data)=>{
      console.log(data.monthlyVariance);

      const svg = d3.select('.chart')
                    .append('svg')
                    .attr('height', h)
                    .attr('width', w);                    

      const minYear = d3.min(data.monthlyVariance, (d) => d.year);
      const maxYear = d3.max(data.monthlyVariance, (d) => d.year);
      const xScale = d3.scaleLinear()
                       .domain([minYear,maxYear])
                       .range([m,w-m]);

      const minMonth = new Date(0,0);
      const maxMonth = new Date(0,11);
      const yScale = d3.scaleTime()
                       .range([m,h-m])
                       .domain([minMonth,maxMonth]);

      barWidth = (w-(m*2))/(maxYear-minYear);
      barHeight = (h-(2*m))/12;
                                             
      let tooltip = d3.select('.chartHolder')
                      .append('div')
                      .attr('id','tooltip')
                      .style('margin-left','500px')
                      .style('margin-right','120px')
                      .style('margin-top','-520px')
                      .style('visibility','hidden')
                      
      const mouseOver = (e,d) => {
          tooltip.transition()
                 .style('visibility','visible')
                 .style('background-color',`${fill(d.variance)}`)
                 .style('color','aliceblue')
          tooltip.text(`${d3.timeFormat('%B')((new Date(0,d.month-1)))} ${d.year} : ${d.variance}°C `)
                 .attr('data-year',d.year)
      }

      const mouseOut = () => {
          tooltip.transition()
                 .style('visibility','hidden');   
      }

      const fill = (data) => {
         if (data < -1) {
            return colors[0];
         } else if (data >= -1 && data < 0 ) {
            return colors[1];
         } else if (data >= 0 && data <= 1 ) {
            return colors[2];
         } else if (data > 1 ) {
             return colors[3];
         }
     }

      svg.selectAll('cell')
         .data(data.monthlyVariance)
         .enter()
         .append('rect')
         .attr('class','cell')
         .attr('x',(d) => xScale(d.year))
         .attr('y',(d) => yScale(new Date(0,d.month-1)))
         .attr('height', barHeight)      
         .attr('width', barWidth)
         .attr('data-month',(d) => d.month-1)
         .attr('data-year',(d) => d.year)
         .attr('data-temp',(d) => d.variance)      
         .attr('fill',(d) => fill(d.variance))
         .on('mouseover',mouseOver)
         .on('mouseout',mouseOut)  

      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'));
      const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));
      svg.append('g')
         .call(xAxis)
         .attr('id','x-axis')
         .attr('transform',`translate(0,${h-15})`)
      svg.append('g')
         .call(yAxis)
         .attr('id','y-axis')
         .attr('transform',`translate(${m},0)`)

      let legend = svg.append('g')
                      .attr('id','legend')
                
      legend.append('text')
            .text('LEGEND (In terms')
            .attr('x','50')
            .attr('y','10')
            .attr('fill', 'aliceblue')       
      legend.append('text')
            .text('of Variance)')
            .attr('x','64')
            .attr('y','20')
            .attr('fill', 'aliceblue') 

      legend.append('rect')
            .attr('width','65px')
            .attr('height','20px')
            .attr('x','150')
            .attr('y','0')
            .attr('fill', colors[0])
      legend.append('text')
            .text('more than')
            .attr('x','151')
            .attr('y','30')
            .attr('fill', 'aliceblue')
      legend.append('text')
            .text('1 below')
            .attr('x','160')
            .attr('y','40')
            .attr('fill', 'aliceblue')
            
      legend.append('rect')
            .attr('width','65px')
            .attr('height','20px')
            .attr('x','215')
            .attr('y','0')
            .attr('fill', colors[1])
      legend.append('text')
            .text('1 below')
            .attr('x','226')
            .attr('y','30')
            .attr('fill', 'aliceblue')  
      legend.append('text')
            .text('to base')
            .attr('x','229')
            .attr('y','40')
            .attr('fill', 'aliceblue')  
            
      legend.append('rect')
            .attr('width','65px')
            .attr('height','20px')
            .attr('x','280')
            .attr('y','0')
            .attr('fill', colors[2])
      legend.append('text')
            .text('base to')
            .attr('x','292')
            .attr('y','30')
            .attr('fill', 'aliceblue')  
      legend.append('text')
            .text('1 above')
            .attr('x','292')
            .attr('y','40')
            .attr('fill', 'aliceblue')       

      legend.append('rect')
            .attr('width','65px')
            .attr('height','20px')
            .attr('x','345')
            .attr('y','0')
            .attr('fill', colors[3])
      legend.append('text')
            .text('more than')
            .attr('x','347')
            .attr('y','30')
            .attr('fill', 'aliceblue')  
      legend.append('text')
            .text('1 above')
            .attr('x','356')
            .attr('y','40')
            .attr('fill', 'aliceblue') 
    })
    .catch((e) => console.log(e));
})