import React from 'react';
import fetch from 'isomorphic-unfetch';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';

import BaseContent from '../components/base-content';
const PDFViewer = dynamic(import('../components/pdf-viewer'), { ssr: false });

class Publication extends React.Component {
  state = {
    viewPdf: true,
  };

  render() {
    const {
      id,
      content,
      kind,
      year,
      number,
      date,
      page,
      document_url,
    } = this.props;
    const { viewPdf } = this.state;

    const pubDate = dayjs(date);

    const titleDate = `am ${pubDate.format('DD.MM.YYYY')}`;
    let comp;
    if (viewPdf) {
      comp = (
        <div className="navbar-item">
          <a
            className="button is-primary"
            onClick={() => this.setState({ viewPdf: !viewPdf })}
          >
            PDF
          </a>
        </div>
      );
    } else {
      comp = (
        <div className="navbar-item">
          <a
            className="button"
            onClick={() => this.setState({ viewPdf: !viewPdf })}
          >
            Text
          </a>
        </div>
      );
    }

    return (
      <BaseContent navItems={comp}>
        <h1 className="title is-1">
          {titleDate}, Nr. {number}, {year}, {kind}
        </h1>
        <PDFViewer
          document_url={document_url}
          viewPdf={viewPdf}
          content={content}
        />
        <div> {content} </div>
      </BaseContent>
    );
  }
}

Publication.getInitialProps = async ({ query }) => {
  const res = await fetch(
    'https://api.offenegesetze.de/v1/amtsblatt/' + query.id
  );
  const json = await res.json();
  return { ...json };
};

export default Publication;
