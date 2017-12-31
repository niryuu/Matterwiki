import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Heading, HelpBlock } from "ui";
import { DisplayFlexRow } from "ui/utils";
import Loader from "components/Loader/Loader";
import { connect } from "react-redux";

import { loadArchivesPage, disposeArchivesPage, fetchArchiveById } from "store/modules/sagaActions";

import BrowseArchives from "./components/BrowseArchives";
import SimpleArticle from "../../components/SimpleArticle";

class ArticleHistory extends React.Component {
  componentDidMount() {
    const { articleId } = this.props.match.params;
    this.props.loadArchivesPage(articleId);
  }

  componentWillUnmount() {
    this.props.disposeArchivesPage();
  }

  getArchive = archiveId => {
    const { articleId } = this.props.match.params;
    this.props.fetchArchiveById(articleId, archiveId);
  };

  render() {
    const { archives, currentArchive, loadingCurrentArchive, loading } = this.props;
    if (loading) return <Loader />;
    else if (archives && archives.length) {
      return (
        <Row>
          <Col widthMedium="25">
            <Heading size="1" transform="uppercase">
              Archives
            </Heading>
            <BrowseArchives
              archives={archives}
              onArchiveChosen={this.getArchive}
              articleId={this.props.match.params.articleId}
              currentArchive={currentArchive}
            />
          </Col>
          <Col>
            <SimpleArticle article={currentArchive} loading={loadingCurrentArchive} />
          </Col>
        </Row>
      );
    }
    return (
      <Row>
        <HelpBlock textAlign="center">
          There are no archives for this article {`   `}
          <Link to={`/article/${this.props.match.params.articleId}`}>Go back</Link>
        </HelpBlock>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  currentArchive: state.archives.currentArchive,
  archives: state.archives.archives,
  loading: state.app.loading,
  loadingCurrentArchive: state.archives.loading
});

const mapDispatchToProps = dispatch => ({
  loadArchivesPage: articleId => dispatch(loadArchivesPage(articleId)),
  disposeArchivesPage: () => dispatch(disposeArchivesPage()),
  fetchArchiveById: (articleId, archiveId) => dispatch(fetchArchiveById(articleId, archiveId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ArticleHistory);
