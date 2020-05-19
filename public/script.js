document.getElementById('btnData').addEventListener('click', function () {
    const t0 = performance.now();
    fetch(window.location.origin + '/api/feedback/show_statistic')
        .then(data => data.json())
        .then(data => {
            createPie(data[0]);
            for (let key in data[0]) {
                data[0][key].forEach(item => {
                    createBarChart(item.AGES_GROUP, item._id, key);
                    createBarChart(item.COUNTRY_GROUP, item._id, key);
                });
            }
            const t1 = performance.now();
            document.querySelector('#perf').innerHTML = `<h3>Performance: ${((t1-t0)/1000).toFixed(2)} sec</h3>`;
        });
});
