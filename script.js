// -------------------------------------------Creando Variables----------------------------------------
let countyURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
let educationURL = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';

let countyData;
let educationData;

let canvas = d3.select('#canvas')
let tooltip = d3.select('#tooltip')

let drawMap = () =>{
  // Seleccionamos los path porque es la manera de trabajar con los svg
  canvas.selectAll('path')
        // Acá unimos los datos del county data a los path
        .data(countyData)
        .enter()
        .append('path')
        // acá convertimos el geoJson en geopath, que permite dibujar un svg
        .attr('d', d3.geoPath())
        .attr('class', 'county')
        .attr('fill', (countyDataItem) =>{
          let id = countyDataItem['id']
          let county = educationData.find((item)=>{
            return item['fips'] === id;
          })
          let percentage = county['bachelorsOrHigher']
          if(percentage <=15){
            return 'tomato';
          } else if( percentage <=30){
            return 'orange';
          } else if(percentage <= 45){
            return 'lightgreen';
          } else{
            return 'green'
          }

        })
        .attr('data-fips', (countyDataItem) =>{
          return countyDataItem['id']
        })
        .attr('data-education', (countyDataItem)=>{
          let id = countyDataItem['id']
          let county = educationData.find((item)=>{
            return item['fips'] === id;
          })
          let percentage = county['bachelorsOrHigher']
          return percentage
        })

        .on('mouseover', (countyDataItem) => {
          tooltip.transition()
                  .style('visibility', 'visible')
      
          let fips = countyDataItem['id']
          let county = educationData.find((county) => {
              return county['fips'] === fips
          })
      
          tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
              county['state'] + ' : ' + county['bachelorsOrHigher'] + '%')
          tooltip.attr('data-education', county['bachelorsOrHigher'])
      })
      .on('mouseout', (countyDataItem) => {
          tooltip.transition()
                  .style('visibility', 'hidden')
      })
}






// -----------------------------------------Fetching Data------------------------------------------------
fetch(countyURL)
  .then(response => response.json())
  .then(data => {
    countyData = topojson.feature(data, data.objects.counties).features;
    console.log(countyData)
    fetch(educationURL)
      .then(response => response.json())
      .then(data => {
        educationData = data;
        console.log(educationData)
        drawMap();
      })
  })