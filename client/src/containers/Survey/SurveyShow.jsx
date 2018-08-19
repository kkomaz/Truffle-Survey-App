import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardHeader, CardContent, CardLoader, CardMedia, Button } from 'components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { range, isUndefined, map, isEmpty, isEqual } from 'lodash-es';
import { ipfsUpload } from 'utils/ipfs';
import txMineCompleted from 'utils/txMineCompleted';

import convertToNumber from 'utils/convertToNumber';
import { createQuestionData } from 'utils/Survey/index';
import SurveyShowButtons from './SurveyShowButtons';
import SurveyShowForm from './SurveyShowForm';
import SurveyShowDisplay from './SurveyShowDisplay';
import SurveyShowDetails from './SurveyShowDetails';

class SurveyShow extends Component {
  static propTypes = {
    surveyId: PropTypes.string.isRequired,
    accountId: PropTypes.string.isRequired,
    surveyContract: PropTypes.object.isRequired,
    web3: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  state = {
    questions: [],
    subheaderText: '',
    rechartsQuestionData: [],
    ipfsHeroImageUrl: 'https://imgplaceholder.com/420x320/cccccc/757575/glyphicon-file',
    submittingipfs: false,
  };

  componentDidMount = async () => {
    const { surveyContract, accountId } = this.props;
    const { ipfsHeroImageUrl } = this.state;
    let allQuestions = [];
    const questionCount = convertToNumber(
      await surveyContract.methods.getQuestionCount().call(),
    );
    const owner = await surveyContract.methods.getOwner().call();
    const surveyRequiredCount = parseInt(await surveyContract.methods.getSurveyRequiredCount().call(), 10);
    const participantCount = convertToNumber(await surveyContract.methods
      .getParticipantCount()
      .call());
    const ipfsHash = await surveyContract.methods.getHashHeroImage().call();
    const ipfsHashUrl = isEmpty(ipfsHash) ? ipfsHeroImageUrl : `https://gateway.ipfs.io/ipfs/${ipfsHash}`;

    if (questionCount === 0) {
      return this.setState({
        questionCount,
        owner,
        surveyRequiredCount,
        participantCount,
        ipfsHeroImageUrl: ipfsHashUrl,
      });
    }

    const surveyResultsTrue = map(await surveyContract.methods.getResults(true).call(), i => convertToNumber(i));
    const surveyResultsFalse = map(await surveyContract.methods.getResults(false).call(), i => convertToNumber(i));
    const rangeQuestionCount = range(questionCount);
    allQuestions = await surveyContract.methods
      .returnAllQuestions(...rangeQuestionCount)
      .call();

    const rechartsQuestionData = createQuestionData(surveyResultsTrue, surveyResultsFalse, 'question');

    const questions = typeof (allQuestions) === 'string' ? [allQuestions] : Object.values(allQuestions);
    const enrolled = await surveyContract.methods.getParticipant(accountId).call();
    const subheaderText = () => {
      if (surveyRequiredCount === participantCount) {
        return 'Survey is officially completed!';
      }

      return enrolled ? 'Already applied - Display Only' : '';
    };

    return this.setState({
      questions,
      questionCount,
      enrolled,
      owner,
      surveyResultsTrue,
      surveyResultsFalse,
      participantCount,
      surveyRequiredCount,
      subheaderText: subheaderText(),
      rechartsQuestionData,
      ipfsHeroImageUrl: ipfsHashUrl,
    });
  };

  getParticipant = async () => {
    const { surveyContract, accountId } = this.props;
    await surveyContract.methods.getParticipant(accountId).call();
  }

  retrievePayment = async () => {
    const { surveyContract, accountId } = this.props;

    const result = await surveyContract.methods.payoutParticipant().send({
      from: accountId,
      gas: 3000000,
    });

    if (result) {
      this.props.history.push('/');
    }
  }

  uploadFile = async (event) => {
    event.preventDefault();
    const { buffer } = this.state;
    const { surveyContract, accountId, web3 } = this.props;

    this.setState({ submittingipfs: true });

    const ipfsHash = await ipfsUpload(buffer);

    this.setState({ ipfsHeroImageUrl: `https://gateway.ipfs.io/ipfs/${ipfsHash}` });

    const request = await surveyContract.methods.sendHashHeroImage(ipfsHash).send({
      from: accountId,
    });

    const tx = request.transactionHash;

    if (txMineCompleted(web3, tx)) {
      this.setState({ submittingipfs: false });
    }
  }

  captureFile = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];

    if (file) {
      let reader = new window.FileReader(); /* eslint-disable-line */
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => this.convertToBuffer(reader);
    }
  }

  convertToBuffer = async (reader) => {
    const buffer = await Buffer.from(reader.result);
    this.setState({ buffer });
  };

  render() {
    const {
      questions,
      questionCount,
      enrolled,
      owner,
      surveyResultsTrue,
      surveyResultsFalse,
      participantCount,
      surveyRequiredCount,
      subheaderText,
      rechartsQuestionData,
      ipfsHeroImageUrl,
      submittingipfs,
    } = this.state;

    const {
      surveyId,
      accountId,
      surveyContract,
      web3,
    } = this.props;

    const ipfsNotifierClass = () => classNames({
      'survey-show__notifier-text': true,
      hidden: !submittingipfs,
      danger: submittingipfs,
    });

    if (isUndefined(questionCount)) {
      return (
        <div className="survey-show container">
          <CardLoader title={surveyId} />
        </div>
      );
    }

    return (
      <div className="survey-show container">
        <div className="row">
          <div className="col-xs-12 col-sm-6">
            <Card>
              <CardHeader title="Survey Questions" subheader={subheaderText} />
              <CardMedia
                title="Contemplative Reptile"
              >
                <img
                  alt="upload"
                  src={ipfsHeroImageUrl}
                  style={{ height: '300px', width: '100%' }}
                />
              </CardMedia>
              <CardContent>
                {
                  isEqual(owner, accountId) &&
                  <div className="survey-show__file-upload">
                    <form onSubmit={this.uploadFile}>
                      <input type="file" onChange={this.captureFile} />
                      <Button
                        text="Upload File"
                        disabled={submittingipfs || surveyContract.balance <= 0}
                        color="primary"
                        type="submit"
                      >
                        Send It
                      </Button>
                    </form>
                    <p className={ipfsNotifierClass()}>
                      Submitting file to ipfs... Please wait for metmask for transaction completion.
                    </p>
                  </div>
                }

                {
                  enrolled &&
                  <Button
                    text="Retrieve Fund"
                    color="primary"
                    onClick={this.retrievePayment}
                    style={{
                      general: {
                        marginLeft: '0px',
                      },
                    }}
                    disabled={surveyRequiredCount !== participantCount}
                  />
                }

                {(enrolled || questionCount === 0 || participantCount === surveyRequiredCount) ? (
                  <SurveyShowDisplay
                    questions={questions}
                    surveyResultsTrue={surveyResultsTrue}
                    surveyResultsFalse={surveyResultsFalse}
                    questionCount={questionCount}
                    surveyRequiredCount={surveyRequiredCount}
                    participantCount={participantCount}
                  />
                ) : (
                  <SurveyShowForm
                    questions={questions}
                    accountId={accountId}
                    surveyContract={surveyContract}
                    surveyResultsTrue={surveyResultsTrue}
                    surveyResultsFalse={surveyResultsFalse}
                    participantCount={participantCount}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="col-xs-12 col-sm-6">
            <Card>
              <CardHeader title="Survey Information" />
              <CardContent>
                <div className="survey-show__contract-details">
                  <div className="row">
                    <div className="col-xs-12">
                      {owner === accountId && (
                        <SurveyShowButtons
                          surveyId={surveyId}
                          questionCount={questionCount}
                          surveyContract={surveyContract}
                          accountId={accountId}
                          web3={web3}
                          participantCount={participantCount}
                          surveyRequiredCount={surveyRequiredCount}
                        />
                      )}
                    </div>

                    <div className="col-xs-12">
                      <p>Survey Address: {surveyId}</p>
                    </div>

                    <div className="col-xs-5">
                      <SurveyShowDetails
                        participantCount={participantCount}
                        surveyRequiredCount={surveyRequiredCount}
                        surveyContract={surveyContract}
                      />
                    </div>

                    <div className="col-xs-7">
                      <BarChart
                        width={300}
                        height={350}
                        data={rechartsQuestionData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="question" />
                        <YAxis interval={1} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="yes" fill="#8884d8" />
                        <Bar dataKey="no" fill="#82ca9d" />
                      </BarChart>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(SurveyShow);
