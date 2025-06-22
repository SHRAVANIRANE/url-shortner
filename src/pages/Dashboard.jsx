import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter } from "lucide-react";
import Error from "@/components/Error";
import useFetch from "@/hooks/UseFetch";
import { getUrls } from "@/db/ApiUrls";
import { getClicksforUrls } from "@/db/ApiClicks";

const Dashboard = () => {
  const { searchQuery, setSearchQuery } = useState("");
  const { user } = UrlState();
  const {
    loading,
    error,
    data: urls,
    fn: fnUrls,
  } = useFetch(getUrls, user?.id);
  const {
    loading: loadingClicks,
    fn: fnClicks,
    data: clicks,
  } = useFetch(
    getClicksforUrls,
    urls?.map((url) => url.id)
  );
  useEffect(() => {
    fnUrls();
  }, []);
  useEffect(() => {
    if (urls.length) fnClicks();
  }, [urls.length]);

  return (
    <div className="flex flex-col gap-8">
      {true && <BarLoader width={"100%"} color="#36d7b7" />}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Links Created</CardTitle>
          </CardHeader>
          <CardContent>
            <p>0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p>0</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold">My Links</h1>
        <Button>Create Link</Button>
      </div>
      <div className="relative">
        <Input
          type="text"
          placeholder="Filter Links..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
      </div>
      <Error message={error.message} />
    </div>
  );
};

export default Dashboard;
