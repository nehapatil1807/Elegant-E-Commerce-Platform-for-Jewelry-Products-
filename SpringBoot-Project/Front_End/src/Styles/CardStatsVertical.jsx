
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";


import DotsVertical from "mdi-material-ui/DotsVertical";

const CardStatsVertical = (props) => {
  // ** Props
  const { title, subtitle, color, icon, stats, trend, trendNumber } = props;

  return (
    <Card>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            marginBottom: 3.25,
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <Avatar
            sx={{
              boxShadow: 3,
              marginRight: 4,
              color: "common.white",
              backgroundColor: `${color}.main`,
            }}
          >
            {icon}
          </Avatar>
          <IconButton
            size="small"
            aria-label="settings"
            className="card-more-options"
            sx={{ color: "text.secondary" }}
          >
            <DotsVertical />
          </IconButton>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
          {title}
        </Typography>
        <Box
          sx={{
            marginTop: 1,
            display: "flex",
            flexWrap: "wrap",
            marginBottom: 1,
            alignItems: "center",
          }}
          className=""
        >
          <Typography variant="h6" sx={{ mr: 2 }} className="">
            {stats}
          </Typography>

          <Typography
            className=""
            
            variant="caption"
            sx={{ color: trend === "positive" ? "success.main" : "error.main" }}
          >
            {trendNumber}
          </Typography>
        </Box>
        <Typography variant="caption">{subtitle}</Typography>
      </CardContent>
    </Card>
  );
};

export default CardStatsVertical;

CardStatsVertical.defaultProps = {
  color: "primary",
  trend: "positive",
};
