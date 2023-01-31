import React, { useState } from "react";
import { Row, Col, Button, Badge } from "antd";
import { useReactMediaRecorder } from "react-media-recorder";
import Text from "antd/lib/typography/Text";
const ScreenRecording = ({
    screen,
    audio,
    video,
    downloadRecordingPath,
    downloadRecordingType,
    emailToSupport
}) => {
    const [recordingNumber, setRecordingNumber] = useState(0);
    const RecordView = () => {
      const {
        status,
        startRecording: startRecord,
        stopRecording: stopRecord,
        mediaBlobUrl
      } = useReactMediaRecorder({ screen, audio, video });
  const startRecording = () => {
        return startRecord();
      };
  const stopRecording = () => {
        const currentTimeStamp = new Date().getTime();
        setRecordingNumber(currentTimeStamp);
        return stopRecord();
      };
  const viewRecording = () => {
        window.open(mediaBlobUrl, "_blank").focus();
      };
  const downloadRecording = () => {
        const pathName = `${downloadRecordingPath}_${recordingNumber}.${downloadRecordingType}`;
        try {
          if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // for IE
            window.navigator.msSaveOrOpenBlob(mediaBlobUrl, pathName);
          } else {
            // for Chrome
            const link = document.createElement("a");
            link.href = mediaBlobUrl;
            link.download = pathName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } catch (err) {
          console.error(err);
        }
      };
    };
  return (
      <div className="Scren-Record-Wrapper" style={{ padding: "5px 20px" }}>
        <Row>
          <Col span="12" style={{ lineHeight: "24px" }}>
            {status && status !== "stopped" && (
              <Text>
                Screen Recording Status: {status && status.toUpperCase()}
              </Text>
            )}
            {status && status === "recording" && (
              <Badge
                className="screen-recording-badge"
                color="#faad14"
                status="processing"
                offset={[2, 0]}
                style={{
                  marginLeft: "5px"
                }}
              />
            )}
          </Col>
          <Col span="12" style={{ textAlign: "right" }}>
            {status && status !== "recording" && (
              <Button
                size="small"
                onClick={startRecording}
                type="primary"
                icon="play-circle"
                className="margin-left-sm"
                ghost
              >
                {mediaBlobUrl ? "Record again" : "Record your Problem"}
              </Button>
            )}
            {status && status === "recording" && (
              <Button
                size="small"
                onClick={stopRecording}
                type="danger"
                icon="stop"
                className="margin-left-sm"
                ghost
              >
                Stop Recording
              </Button>
            )}
            {mediaBlobUrl && status && status === "stopped" && (
              <Button
                size="small"
                onClick={viewRecording}
                type="primary"
                icon="picture"
                className="viewRecording margin-left-sm"
              >
                View
              </Button>
            )}
            {downloadRecordingType &&
              mediaBlobUrl &&
              status &&
              status === "stopped" && (
                <Button
                  size="small"
                  onClick={downloadRecording}
                  type="primary"
                  icon="download"
                  className="downloadRecording margin-left-sm"
                >
                  Download
                </Button>
              )}
          </Col>
        </Row>
      </div>
    );
  };
  export default ScreenRecording;