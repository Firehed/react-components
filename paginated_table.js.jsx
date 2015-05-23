/**
 * Paginated Table React component
 * (c) 2015 Eric Stern
 *
 *  This extends a Table component to add pagination across large datasets, by
 *  loading data over AJAX and adding navigation components to the table header
 *  and footer.
 *
 *  Configuration:
 *    columns: Array<string>
 *    endpoint: string
 *    extractor: [function]
 *    limit_param: [string="limit"]
 *    page_param: [string="page"]
 *    rows_per_page: [integer=20]
 *
 *  Data will be loaded by making a GET request to the endpoint value, with the
 *  limit and page values in the query string (meaning the endpoint may need to
 *  translate the page into SQL offset)
 *
 *  The extractor function, if provided, will be run on each row of the returned
 *  data, to transform it client-side as needed. It should accept a data type in
 *  accordance with the endpoint's output, and return an array. The cells will
 *  be rendered in the table in the same order this returns, there is no keying
 *  supported. This may be used to transform the data types; e.g. transform
 *  a Unix Timestamp from the server into a human-readable string.
 *
 *  Columns must be an Array of Strings, which will be shown in the <thead>
 *
 */
var PaginatedTable = React.createClass({
	componentDidMount: function() {
		this.loadData();
	},
	loadData: function() {
		data = {};
		data[this.props.page_param] = this.state.page;
		data[this.props.limit_param] = this.props.rows_per_page;

		$.ajax(this.props.endpoint, {
			data: data,
			dataType: "json",
			error: function(e) { alert(e); },
			method: "GET",
			success: function(ret) {
				if (this.props.extractor) {
					rows = ret.map(this.props.extractor);
				} else {
					rows = ret;
				}
				this.setState({
					rows: rows,
				});
			}.bind(this),
		});
	},
	firstPage: function() {
		this.moveToPage(0);
	},
	lastPage: function() {
		console.log("LastPage is not implemented yet!");
		return;
	},
	nextPage: function() {
		// fixme: this should be replaced with an upper bound, like prevPage
		if (true) {
			this.moveToPage(this.state.page+1);
		}
	},
	prevPage: function() {
		if (this.state.page >= 1) {
			this.moveToPage(this.state.page-1);
		}
	},
	moveToPage: function(page) {
		// Do nothing if we're already on the specified page.
		if (this.state.page == page) {
			return;
		}
		this.setState({
			page: page,
//			rows:[],  // Re-add to empty the table when AJAX-loading
		}, this.loadData);
	},
	getDefaultProps: function() {
		return {
			columns: {},
			endpoint: "",
			extractor: null,
			limit_param: "limit",
			page_param: "page",
			rows_per_page: 20,
		};
	},
	getInitialState: function() {
		return {
			page: 0,
			rows: [],
		};
	},
	render: function() {
		var headers = [];
		var columns = [];

		// Build pagination navigation
		colCount = this.props.columns.length;
		var nav =
		<tr>
			<th colSpan={colCount} className="nav">
				<a onClick={this.firstPage}>FIRST</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
				<a onClick={this.prevPage}>BACK</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
				Page {this.state.page + 1}&nbsp;&nbsp;&middot;&nbsp;&nbsp;
				<a onClick={this.nextPage}>NEXT</a>&nbsp;&nbsp;&middot;&nbsp;&nbsp;
				<a onClick={this.lastPage}>LAST</a>
			</th>
		</tr>

		headers.push(this.props.columns);
		headers.push(nav);
		var footers = [nav];
		return <Table
			headers={headers}
			rows={this.state.rows}
			footers={footers} />;
	},
});
