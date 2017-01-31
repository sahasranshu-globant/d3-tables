var data = [
                    { packagetype : "Internal R...", None : 45,Others : 4 ,id:"1"},
                    { packagetype : "Internal T...", None : 55,Others : 7 ,id:"2"},
                    { packagetype : "Customer R...", None : 40,Others : 3 ,id :"3"},
                    { packagetype : "Legacy Def...", None : 32,Others : 8,id :"4" },
                    { packagetype : "New Request...", None : 47,Others : 6,id :"5" },
                    { packagetype : "POC...", None : 56,Others : 10,id :"6" },
                    { packagetype : "Defect Count..", None : 73,Others : 5,id :"7"},
                    { packagetype : "Acceptance Rate", None: 90,Others : 2,id :"8" },
                    { packagetype : "Defect Analysis...", None : 45,Others : 4 ,id:"9"},
                    { packagetype : "Quality...", None : 55,Others : 7 ,id:"10"},
                    { packagetype : "Customer R...", None : 40,Others : 3 ,id :"11"},
                    { packagetype : "Pull Requests...", None : 32,Others : 8,id :"12" },
                    { packagetype : "Defect Removal Efficiency", None : 47,Others : 6,id :"13" },
                    { packagetype : "Failure Cost...", None : 56,Others : 10,id :"14" },
                    { packagetype : "Prevention Cost", None : 73,Others : 5,id :"15"},
                    { packagetype : "Open Issues", None : 90,Others : 2,"id" :"16" },
                    { packagetype : "Resource Allocation", None : 47,Others : 6,id :"17" },
                    { packagetype : "Cost of Quality...", None : 56,Others : 10,id :"18" },
                    { packagetype : "Design Defects", None : 73,Others : 5,id :"19"},
                    { packagetype : "Closed Issues", None : 90,Others : 2,id :"20" }
                ];
var column_names = ["Package Type","None","Others"];
var clicks = {packagetype: 0, none: 0, others: 0};
var totals = [];

// draw the tableD
// d3.select("body").append("div")
//   .attr("id", "container")
//   .attr("class","container")

// d3.select("#container").append("div")
//   .attr("id", "FilterableTable")
//   .attr("class" ,"table-responsive");

/*d3.select("#FilterableTable").append("h1")
  .attr("id", "title")
  .text("My D3 Table")

d3.select("#FilterableTable").append("div")
  .attr("class", "SearchBar")
  .append("p")
    .attr("class", "SearchBar")
    .text("Search By Category:");

d3.select(".SearchBar")
  .append("input")
    .attr("class", "SearchBar")
    .attr("id", "search")
    .attr("type", "text")
    .attr("placeholder", "Search...");*/

var table, headers;
var rows, row_entries, row_entries_no_anchor, row_entries_with_anchor, showInlineFilter;
var paginationoff, pageSize, pageLimit, viewdata, nxt, prv, first, last;
var page = 1;
var column_categories=[];
var filterContainer,filterOptions;
function drawTable(id, pagination, showInlineFilterbool){
    paginationoff = pagination;
    showInlineFilter = showInlineFilterbool;
    d3.select("#"+id).append("div").attr({"class":"filter-icon", "id":"filter-icon"}).append("i").attr({"class":"fa fa-filter", "aria-hidden":"true"});
    
    table = d3.select("#"+id).append("table").attr("class","table table-bordered");
    table.append("thead").append("tr"); 

    headers = table.select("tr").selectAll("th")
    .data(column_names)
    .enter()
    .append("th")
    .text(function(d, i) {return d;});
    //.text(function(d) { return d; });
    
    
    //totals['packagetype'] = 'Total';
    /*data.forEach(function (d) {
        console.log(d);
        column_names.forEach(function (k, i) {
            console.log(k, i);
            if (k !== column_names[i]) {
              if (k in totals) {
                totals[k] += d[k];
              } else {
                totals[k] = d[k];
              }
            }
        });
    });
    console.log(totals);
    //data.push(totals);*/
    
    if(paginationoff === true){
        pageSize = data.length;
        d3.select("#paginationBar").style("display","none");
        drawTablePagination();
    } else{
        pageSize = 5;
        drawTablePagination();
    }
    
}
  
function drawTablePagination(){ 
    
    pageLimit = Math.ceil(data.length/pageSize);
    viewdata = data.slice((page-1)*pageSize,page*pageSize);


    d3.select("#pageNO").attr("value",page);
    d3.select("#totalPages").attr("value",pageLimit);
    
    addRowData();
    
    nxt = d3.select('#next');
    prv = d3.select('#previous');
    first = d3.select('#first');
    last = d3.select('#last');
    
    attachListeners();
}

function addFilterRow(){
    var firstRow = table.select("tbody").append("tr").attr({"class":"filter-row","id":"filter-row"}).style("display", "none").classed("open", false);
    for(var m=0; m<column_names.length; m++){
        firstRow.append("td").append("input").attr({"type":"text", "id":"input_"+column_names[m].replace(/ /g,'')});
    }
}

function addRowData(){
    table.append("tbody");
    if(showInlineFilter == true){
        addFilterRow();       
    }
    
    
    // data bind    
    rows = table.select("tbody").selectAll("tr").data(viewdata, function(d){ if(d!=undefined)return d.id; });

    // enter the rows
    rows.enter().append("tr")

    // enter td's in each row
    row_entries = rows.selectAll("td")
      .data(function(d) { 
        var arr = [];
        for (var k in d) {
          if (d.hasOwnProperty(k)) {
        arr.push(d[k]);
          }
        }
        return [arr[0],arr[1],arr[2]];
      })
    .enter()
      .append("td") 

    // draw row entries with no anchor 
    row_entries_no_anchor = row_entries.filter(function(d) {
        return (/https?:\/\//.test(d) == false)
    });
    
    row_entries_no_anchor.text(function(d) { return d; });
}

function setPage(elm){
    var pagenum = page;
    if(elm == "first"){
        pagenum = 1
    }else if(elm == "last"){
        pagenum = Math.ceil(data.length/pageSize);
    }else if(elm == "next" && page < pageLimit){
        pagenum++;
    }else if(elm == "previous" && page > 1){
        pagenum--;
    }
    
    page = pagenum;
}

/*gets unique column categories entries .. Currently below function gets unique entries of packagetype column data*/
function getColumnCategories(){
  var flags = [],l = data.length, i;
  for( i=0; i<l; i++) {
    if( flags[data[i].packagetype]) continue;
    flags[data[i].packagetype] = true;
    column_categories.push(data[i].packagetype);
  }
};

/* onclick of filter icon below function displays checkboxes with id as a categories of table column*/
function addFilterItems(){

  filterContainer =  d3.select('#filter-icon').append("div").attr({"id":"filter-list-container"});
  filterOptions = filterContainer.append("ul").attr({"class":"list","id":"filter-list"});
  for(var m=0; m<column_categories.length; m++){
    filterOptions.append("li").append("input").attr({"type":"checkbox", "id":column_categories[m]}).text(column_categories[m]);

  }
  
  filterContainer.append("input").attr({"type":"button","value":"Apply","id":"apply"});
  filterContainer.select('#apply').on("click",function(){
     var searchValues = [];
     var selectedArray = filterOptions.selectAll("li input[type=checkbox]:checked");
     selectedArray = _.flatten(selectedArray);
     _.each(selectedArray,function(element){
        searchValues.push(element.id);
     });
     filterTable(searchValues); 
  }); 
};

/* search records according to selected categories in filter */
function filterTable(searchArray){
  var searchResult = [];
   _.each(searchArray,function(field){
    var a = _.where(data,{packagetype: field});
    searchResult.push(a);
   })
    
   searchResult = _.flatten(searchResult);  
   rows = table.select("tbody").selectAll("tr")
      .data(searchResult, function(d){  if(d!=undefined)return d.id; })
    
        // enter the rows
        rows.enter()
         .append("tr");
         
        // enter td's in each row
        row_entries = rows.selectAll("td")
            .data(function(d) { 
              var arr = [];
              for (var k in d) {
                if (d.hasOwnProperty(k)) {
              arr.push(d[k]);
                }
              }
              return [arr[0],arr[1],arr[2]];
            })
          .enter()
            .append("td") 

        // draw row entries with no anchor 
        row_entries_no_anchor = row_entries.filter(function(d) {
          return (/https?:\/\//.test(d) == false)
        })
        row_entries_no_anchor.text(function(d) { return d; })

        
        
        // exit
        rows.exit().remove();
  
};

function attachListeners(){
    d3.selectAll('.pagination-action').on("click", function(d, i){
        setPage(this.id);
        d3.select("#pageNO").attr("value",page);
        viewdata = data.slice((page-1)*pageSize,page*pageSize);
        redraw();
    });
    
    
   /*d3.select("#pageNO").on("keyup",function(){
       page = Number(this.value.trim());
       console.log(page);
       viewdata = data.slice((page-1)*pageSize,page*pageSize);
       redraw();
   });*/
    
    if(showInlineFilter == true){
        d3.select('#filter-icon').select('i').on("click", function(d, i){
          console.log(d);
            if(table.select("tr#filter-row").classed('open')){
                table.select("tr#filter-row").transition().transition().style("display", "none").each("end", function(){
                   d3.select(this).classed("open", false);
                });
            }else{
                table.select("tr#filter-row").transition().transition().style("display", "block").each("end", function(){
                   d3.select(this).classed("open", true);
                });
            }

        });
        
        d3.select("#filter-row").select("td>input").on("keyup", function(d) {
            if(d3.event.keyCode == 13){
                searchTable(this);
            }
        });
    }
    
    if(showInlineFilter == false){
      d3.select('#filter-icon').select('i').on("click", function(d, i){
          getColumnCategories();
          addFilterItems();
      });
    }
    
    
    
    /**  sort functionality **/
  headers.on("click", function(d) {
           if (d == "Package Type") {
        clicks.packagetype++;
        // even number of clicks
        if (clicks.packagetype % 2 == 0) {
          // sort ascending: alphabetically
          rows.sort(function(a,b) { 
            if (a.packagetype.toUpperCase() < b.packagetype.toUpperCase()) { 
              return -1; 
            } else if (a.packagetype.toUpperCase() > b.packagetype.toUpperCase()) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.packagetype % 2 != 0) { 
          // sort descending: alphabetically
          rows.sort(function(a,b) { 
            if (a.packagetype.toUpperCase() < b.packagetype.toUpperCase()) { 
              return 1; 
            } else if (a.packagetype.toUpperCase() > b.packagetype.toUpperCase()) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      } 
      if (d == "None") {
      clicks.none++;
        // even number of clicks
        if (clicks.none % 2 == 0) {
          // sort ascending: numerically
          rows.sort(function(a,b) { 
            if (+a.None < +b.None) { 
              return -1; 
            } else if (+a.None > +b.None) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.none % 2 != 0) { 
          // sort descending: numerically
          rows.sort(function(a,b) { 
            if (+a.None < +b.None) { 
              return 1; 
            } else if (+a.None > +b.None) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      } 

      if (d == "Others") {
      clicks.others++;
        // even number of clicks
        if (clicks.others % 2 == 0) {
          // sort ascending: numerically
          rows.sort(function(a,b) { 
            if (+a.Others < +b.Others) { 
              return -1; 
            } else if (+a.Others > +b.Others) { 
              return 1; 
            } else {
              return 0;
            }
          });
        // odd number of clicks  
        } else if (clicks.others % 2 != 0) { 
          // sort descending: numerically
          rows.sort(function(a,b) { 
            if (+a.Others < +b.Others) { 
              return 1; 
            } else if (+a.Others > +b.Others) { 
              return -1; 
            } else {
              return 0;
            }
          });
        }
      } 
      
      
    }) // end of click listeners
    
    
}


  function redraw() {
    rows = table.select("tbody").selectAll("tr")
      .data(viewdata, function(d){  if(d!=undefined)return d.id; })
    
        // enter the rows
        rows.enter()
         .append("tr");
         
        // enter td's in each row
        row_entries = rows.selectAll("td")
            .data(function(d) { 
              var arr = [];
              for (var k in d) {
                if (d.hasOwnProperty(k)) {
              arr.push(d[k]);
                }
              }
              return [arr[0],arr[1],arr[2]];
            })
          .enter()
            .append("td") 

        // draw row entries with no anchor 
        row_entries_no_anchor = row_entries.filter(function(d) {
          return (/https?:\/\//.test(d) == false)
        })
        row_entries_no_anchor.text(function(d) { return d; })

        
        
        // exit
        rows.exit().remove();

}

function searchTable(obj){
    /**  search functionality **/
    var searched_data = data,
            text = obj.value.trim();
        
        var searchResults = searched_data.map(function(r) {
          console.log(r);
          var regex = new RegExp("^" + text + ".*", "i");
          if (regex.test(r.packagetype)) { // if there are any results
            return regex.exec(r.packagetype)[0]; // return them to searchResults
          } 
        })
      
      // filter blank entries from searchResults
        searchResults = searchResults.filter(function(r){ 
          return r != undefined;
        })
        
        // filter dataset with searchResults
        searched_data = searchResults.map(function(r) {
           return data.filter(function(p) {
            console.log(p);
            return p.packagetype.indexOf(r) != -1;
          })
        })

        // flatten array 
    searched_data = [].concat.apply([], searched_data)
    
    if(showInlineFilter == true){
        addFilterRow();        
    }
        
        // data bind with new data
    rows = table.select("tbody").selectAll("tr")
      .data(searched_data, function(d){  if(d!=undefined)return d.id; })
    
        // enter the rows
        rows.enter()
         .append("tr");
         
        // enter td's in each row
        row_entries = rows.selectAll("td")
            .data(function(d) { 
              var arr = [];
              for (var k in d) {
                if (d.hasOwnProperty(k)) {
              arr.push(d[k]);
                }
              }
              return [arr[0],arr[1],arr[2]];
            })
          .enter()
            .append("td") 

        // draw row entries with no anchor 
        row_entries_no_anchor = row_entries.filter(function(d) {
          return (/https?:\/\//.test(d) == false)
        })
        row_entries_no_anchor.text(function(d) { return d; })

        
        
        // exit
        rows.exit().remove();
}
//});
//d3.select(self.frameElement).style("height", "780px").style("width", "1150px"); 
