/**
 * React Table component
 * (c) 2015 Eric Stern
 *
 * This is a relatively straightforward table builder
 *
 * Configuration:
 *   headers: Array<Array<string>|ReactElement>
 *   footers: Array<Array<string>|ReactElement>
 *   rows: Array<Array<mixed>|ReactElement>
 *
 * In all three parameters, the outer array represents a row, and the inner
 * element represents its cells. If the inner element is a ReactElement, it will
 * be rendered as-is; if it is an array, it will be wrapped in a <tr> and  each
 * inner array element will be wrapped in a <td> or <th> and displayed. The
 * common case for passing a ReactElement is when an entire row must be built
 * externally, such as customizing colSpan values or adding other attributes. It
 * is assumed that the ReactElement's render method will return an
 * appropriately-configured <tr> containing cells.
*/
// Basic <table> wrapper, which builds out the tbody/thead/tfoot contents
var Table = React.createClass({
	render: function() {
		return (
			<table>
				<Table.Section
					type="thead"
					rows={this.props.headers} />
				<Table.Section
					type="tfoot"
					rows={this.props.footers} />
				<Table.Section
					type="tbody"
					rows={this.props.rows} />
			</table>
		);
	}
});

// Builds out the major table sections (thead/tbody/tfoot)
Table.Section = React.createClass({
	getDefaultProps: function() {
		return {
			rows: [],
			type: "tbody",
		};
	},
	render: function() {
		var th = false;
		if (this.props.type != "tbody") {
			th = true;
		}
		rows = this.props.rows.map(function(row, i) {
			return <Table.Row
				key={i}
				cells={row}
				th={th} />
		}.bind(this));
		if (this.props.type == "tbody") {
			return <tbody>{rows}</tbody>;
		} else if (this.props.type == "thead") {
			return <thead>{rows}</thead>;
		} else if (this.props.type == "tfoot") {
			return <tfoot>{rows}</tfoot>;
		}
	},
});

// Builds the rows contained within a table section
Table.Row = React.createClass({
	getDefaultProps: function() {
		return { cells: [], th: false };
	},
	render: function() {

		// If cells is a ReactElement instead of an array of primitives, return
		// it outright. This is primarily for paginated navigation, which needs
		// to inject a colSpan attribute, and we don't really want to deal with
		// best-guessing when to skip cells.
		if (typeof this.props.cells._isReactElement === "boolean" &&
			this.props.cells._isReactElement) {
			return this.props.cells;
		}

		th = this.props.th;
		cells = this.props.cells.map(function(cell, i) {
			if (th) {
				return <th key={i}>{cell}</th>
			} else {
				return <td key={i}>{cell}</td>
			}
		});

		return <tr>{cells}</tr>
	},
});

