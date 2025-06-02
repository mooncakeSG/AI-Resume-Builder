import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  CircularProgress,
  Alert,
  Grid,
  Divider
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Lightbulb,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';

const ATSAnalysis = ({ analysisData, loading, error }) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!analysisData) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'success.main';
    if (score >= 60) return 'warning.main';
    return 'error.main';
  };

  // Section-by-section scores
  const sectionScores = analysisData.sectionScores || {};
  const sectionScoreKeys = Object.keys(sectionScores);

  // Keyword density (present keywords)
  const presentKeywords = Array.isArray(analysisData.keywords?.present)
    ? analysisData.keywords.present
    : [];
  const presentIsObject = presentKeywords.length > 0 && typeof presentKeywords[0] === 'object';

  // Formatting warnings
  const formattingWarnings = analysisData.formattingWarnings || [];

  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ATS Compatibility Analysis
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Overall Score</Typography>
              <Typography
                variant="h3"
                color={getScoreColor(analysisData.overallScore)}
              >
                {analysisData.overallScore}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Format Score</Typography>
              <Typography
                variant="h3"
                color={getScoreColor(analysisData.formattingScore?.score)}
              >
                {analysisData.formattingScore?.score ?? '--'}%
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Typography variant="subtitle1">Content Score</Typography>
              <Typography
                variant="h3"
                color={getScoreColor(analysisData.contentScore?.score)}
              >
                {analysisData.contentScore?.score ?? '--'}%
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Section-by-section scores */}
        {sectionScoreKeys.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Section Scores
            </Typography>
            <Grid container spacing={2}>
              {sectionScoreKeys.map((section) => (
                <Grid item xs={6} md={3} key={section}>
                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      {section.charAt(0).toUpperCase() + section.slice(1)}
                    </Typography>
                    <Typography
                      variant="h5"
                      color={getScoreColor(sectionScores[section])}
                    >
                      {sectionScores[section]}%
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Formatting Warnings */}
        {formattingWarnings.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" color="error" gutterBottom>
              Formatting Warnings
            </Typography>
            <List>
              {formattingWarnings.map((warning, idx) => (
                <ListItem key={idx}>
                  <ListItemIcon>
                    <Warning color="error" />
                  </ListItemIcon>
                  <ListItemText primary={warning} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Issues Found
        </Typography>
        <List>
          {(analysisData.issues || []).map((issue, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Warning color="warning" />
              </ListItemIcon>
              <ListItemText
                primary={issue.section}
                secondary={
                  <List>
                    {(issue.problems || []).map((problem, pIndex) => (
                      <ListItem key={pIndex} dense>
                        <ListItemText secondary={problem} />
                      </ListItem>
                    ))}
                  </List>
                }
              />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Recommendations
        </Typography>
        <List>
          {(analysisData.recommendations || []).map((rec, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Lightbulb color="info" />
              </ListItemIcon>
              <ListItemText primary={rec} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>
          Keyword Analysis
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="success.main" gutterBottom>
            Present Keywords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {presentIsObject
              ? presentKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={`${keyword.word} (${keyword.count})`}
                    color="success"
                    icon={<CheckCircle />}
                    variant="outlined"
                  />
                ))
              : presentKeywords.map((keyword, index) => (
                  <Chip
                    key={index}
                    label={keyword}
                    color="success"
                    icon={<CheckCircle />}
                    variant="outlined"
                  />
                ))}
          </Box>
        </Box>
        <Box>
          <Typography variant="subtitle2" color="error.main" gutterBottom>
            Missing Keywords
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {(analysisData.keywords?.missing || []).map((keyword, index) => (
              <Chip
                key={index}
                label={keyword}
                color="error"
                icon={<Error />}
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        {analysisData.keywordOptimization && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" gutterBottom>
              Suggested Phrase Optimizations
            </Typography>
            <List>
              {analysisData.keywordOptimization.suggestedPhrases.map((phrase, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TrendingUp color="success" />
                  </ListItemIcon>
                  <ListItemText
                    primary={phrase.optimized}
                    secondary={
                      <>
                        <TrendingDown color="error" sx={{ mr: 1, verticalAlign: 'bottom' }} />
                        {phrase.original}
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ATSAnalysis; 