// @ts-nocheck
import { ANALYTICS_DOMAIN } from '@chirpy-dev/utils';
import clsx from 'clsx';
import React from 'react';

import * as api from '../../analytics-api';
import styles from '../../analytics.module.scss';
import { Link } from '../../components/link';
import numberFormatter from '../../number-formatter';
import { parseQuery } from '../../query';
import Modal from './modal';

class ExitPagesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      query: parseQuery(props.location.search, props.site),
      pages: [],
      page: 1,
      moreResultsAvailable: false,
    };
  }

  componentDidMount() {
    this.loadPages();
  }

  loadPages() {
    const { query, page } = this.state;

    api
      .getStats(
        `/api/stats/${ANALYTICS_DOMAIN}/exit-pages`,
        this.props.site,
        query,
        {
          limit: 100,
          page,
        },
      )
      .then((res) =>
        this.setState((state) => ({
          loading: false,
          pages: [...state.pages, ...res],
          moreResultsAvailable: res.length === 100,
        })),
      );
  }

  loadMore() {
    this.setState(
      { loading: true, page: this.state.page + 1 },
      this.loadPages.bind(this),
    );
  }

  formatPercentage(number) {
    return typeof number === 'number' ? number + '%' : '-';
  }

  showConversionRate() {
    return !!this.state.query.filters.goal;
  }

  showExtra() {
    return this.state.query.period !== 'realtime' && !this.showConversionRate();
  }

  label() {
    if (this.state.query.period === 'realtime') {
      return 'Current visitors';
    }

    if (this.showConversionRate()) {
      return 'Conversions';
    }

    return 'Visitors';
  }

  renderPage(page) {
    const query = new URLSearchParams(window.location.search);
    query.set('exit_page', page.name);

    return (
      <tr className="text-sm dark:text-gray-200" key={page.name}>
        <td className="p-2">
          <Link
            disabled
            href={`/${encodeURIComponent(
              this.props.site.domain,
            )}?${query.toString()}`}
            className="hover:underline"
          >
            {page.name}
          </Link>
        </td>
        {this.showConversionRate() && (
          <td className="w-32 p-2 font-medium" align="right">
            {numberFormatter(page.total_visitors)}
          </td>
        )}
        <td className="w-32 p-2 font-medium" align="right">
          {numberFormatter(page.unique_exits)}
        </td>
        {this.showExtra() && (
          <td className="w-32 p-2 font-medium" align="right">
            {numberFormatter(page.total_exits)}
          </td>
        )}
        {this.showExtra() && (
          <td className="w-32 p-2 font-medium" align="right">
            {this.formatPercentage(page.exit_rate)}
          </td>
        )}
        {this.showConversionRate() && (
          <td className="w-32 p-2 font-medium" align="right">
            {numberFormatter(page.conversion_rate)}%
          </td>
        )}
      </tr>
    );
  }

  renderLoading() {
    if (this.state.loading) {
      return (
        <div className={clsx('my-16 mx-auto', styles.loading)}>
          <div></div>
        </div>
      );
    } else if (this.state.moreResultsAvailable) {
      return (
        <div className="my-4 w-full text-center">
          <button
            onClick={this.loadMore.bind(this)}
            type="button"
            className="button"
          >
            Load more
          </button>
        </div>
      );
    }
  }

  renderBody() {
    if (this.state.pages) {
      return (
        <React.Fragment>
          <h1 className="text-xl font-bold dark:text-gray-100">Exit Pages</h1>

          <div className="my-4 border-b border-gray-300"></div>
          <main className="modal__content">
            <table
              className={clsx(
                'w-max overflow-x-auto md:w-full',
                styles['table-striped'],
                styles['table-fixed'],
              )}
            >
              <thead>
                <tr>
                  <th
                    className="w-48 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400 md:w-56 lg:w-1/3"
                    align="left"
                  >
                    Page url
                  </th>
                  {this.showConversionRate() && (
                    <th
                      className="w-32 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
                      align="right"
                    >
                      Total Visitors{' '}
                    </th>
                  )}
                  <th
                    className="w-32 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
                    align="right"
                  >
                    {this.label()}
                  </th>
                  {this.showExtra() && (
                    <th
                      className="w-32 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
                      align="right"
                    >
                      Total Exits
                    </th>
                  )}
                  {this.showExtra() && (
                    <th
                      className="w-32 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
                      align="right"
                    >
                      Exit Rate
                    </th>
                  )}
                  {this.showConversionRate() && (
                    <th
                      className="w-32 p-2 text-xs font-bold tracking-wide text-gray-500 dark:text-gray-400"
                      align="right"
                    >
                      CR
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>{this.state.pages.map(this.renderPage.bind(this))}</tbody>
            </table>
          </main>
        </React.Fragment>
      );
    }
  }

  render() {
    return (
      <Modal site={this.props.site}>
        {this.renderBody()}
        {this.renderLoading()}
      </Modal>
    );
  }
}

export default ExitPagesModal;
