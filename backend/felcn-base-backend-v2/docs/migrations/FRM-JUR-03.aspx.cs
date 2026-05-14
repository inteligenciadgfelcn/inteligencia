using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Forms_FRM_JUR_03 : System.Web.UI.Page
{
    string usuariolog = HttpContext.Current.User.Identity.Name;
    string pase = Servicio.Verificarusuario(HttpContext.Current.User.Identity.Name);
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            String s = Request.QueryString["id"];
            buscaop(s.Trim());
            Muestrabienes();
            ComboTipoDocum();
            Muestraarchivos();
        }
    }
    private void buscaop(string valoridop)
    {
        string strSQLverif = "SELECT ASIGNACION.Casos_Id, ASIGNACION.NroCaso, ASIGNACION.NroOperativo, ASIGNACION.NombreCaso, ASIGNACION.AsigCaso, ASIGNACION.FiscalAsigCaso, ASIGNACION.NroCasoPerDom, ASIGNACION.IANUS, ETAPAINVEST.Descripcion, OPERATIVO.Op_Descripcion, OPERATIVO.Op_Id " +
                             "FROM ASIGNACION INNER JOIN ETAPAINVEST ON ASIGNACION.Eta_Inv = ETAPAINVEST.Eta_Inv INNER JOIN OPERATIVO ON ASIGNACION.Casos_Id = OPERATIVO.Casos_Id " +
                             "WHERE (ASIGNACION.Casos_Id = " + Convert.ToInt32(valoridop.Trim()) + ")";
        DataTable dtlista = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        SqlCommand cmdrev = new SqlCommand(strSQLverif);
        cmdrev.CommandType = CommandType.Text;
        cmdrev.Connection = SqlConn;
        SqlDataAdapter sdrev = new SqlDataAdapter(cmdrev);
        sdrev.Fill(dtlista);
        for (int i = 0; i < dtlista.Rows.Count; i++)
        {
            lblidcaso.Text = dtlista.Rows[i][0].ToString();
            txtnrocaso.Text = dtlista.Rows[i][1].ToString();
            txtnroop.Text = dtlista.Rows[i][2].ToString();
            txtnombrecaso.Text = dtlista.Rows[i][3].ToString();
            txtasignadocaso.Text = dtlista.Rows[i][4].ToString();
            txtfiscalasignado.Text = dtlista.Rows[i][5].ToString();
            txtperdom.Text = dtlista.Rows[i][6].ToString();
            lblcud.Text = dtlista.Rows[i][7].ToString();
            lbletapa.Text = dtlista.Rows[i][8].ToString();
            lblidoperativo.Text = dtlista.Rows[i][10].ToString();
        }
        SqlConn.Close();
    }
    protected void Muestrabienes()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT ITEMBIENSECUESTRADO.ItemBienSec_Id AS bien1, BIENES.Descripcion AS bien2, CATALOGOCLASE.Descripcion AS bien3, CATALOGOTIPO.Descripcion AS bien4, ITEMBIENSECUESTRADO.CantidadBien AS bien5 " +
                                                "FROM ITEMBIENSECUESTRADO INNER JOIN CATALOGOTIPO ON ITEMBIENSECUESTRADO.CatTipo_Id = CATALOGOTIPO.CatTipo_Id INNER JOIN CATALOGOCLASE ON CATALOGOTIPO.CatClas_Id = CATALOGOCLASE.CatClas_Id INNER JOIN BIENES ON CATALOGOCLASE.Bien_Id = BIENES.Bien_Id INNER JOIN OPERATIVO ON ITEMBIENSECUESTRADO.Op_Id = OPERATIVO.Op_Id INNER JOIN UNIDADES ON OPERATIVO.Uni_Id = UNIDADES.Uni_Id " +
                                                "WHERE (OPERATIVO.Op_Id = " + Convert.ToInt32(lblidoperativo.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridbien.DataSource = ds;
        gridbien.DataBind();
        con.Close();
    }
    protected void gridbien_RowDataBound(object sender, GridViewRowEventArgs e)
    {
        if (e.Row.RowType == DataControlRowType.DataRow)
        {
            string Idbienes = gridbien.DataKeys[e.Row.RowIndex].Value.ToString();
            SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
            con.Open();
            SqlDataAdapter cmd1 = new SqlDataAdapter("SELECT ITEMBIENCARACTERISTICAS.ItemBienCar_Id AS carac1, CATALOGOCARACTERISTICAS.Descripcion AS carac2, ITEMBIENCARACTERISTICAS.Descripcion AS carac3 FROM CATALOGOCARACTERISTICAS INNER JOIN ITEMBIENCARACTERISTICAS ON CATALOGOCARACTERISTICAS.CatCarac_Id = ITEMBIENCARACTERISTICAS.CatCarac_Id WHERE (ITEMBIENCARACTERISTICAS.ItemBienSec_Id =" + Convert.ToInt32(Idbienes.Trim()) + ")", con);
            DataSet ds1 = new DataSet();
            GridView gvcarac = e.Row.FindControl("gridcaracteristicas") as GridView;
            cmd1.Fill(ds1);
            gvcarac.DataSource = ds1;
            gvcarac.DataBind();
            con.Close();
        }
    }
    protected void gridbien_SelectedIndexChanged(object sender, EventArgs e)
    {
        GridViewRow row = gridbien.SelectedRow;
        LblIdBien.Text = row.Cells[0].Text;
        MuestraSecuestrado();
        MuestraIncautado();
        MuestraConfiscado();
        MuestraDominio();
        CalidadBien();
        Muestraestado();
    }
    // BIENES SECUESTRADOS
    private void limpiaSecuestrado()
    {
        txtsecfiscal.Text = "";
        txtsecfechasec.Text = "";
        txtsecinvestig.Text = "";
        txtsecfiscal.Focus();
    }
    private void MuestraSecuestrado()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT BSec_Id AS BS1, Fiscal AS BS3, FechaActSec AS BS4, Investigador AS BS5 FROM BIENESSECUESTADOS WHERE (ItemBienSec_Id = " + Convert.ToInt32(LblIdBien.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridsecuestrado.DataSource = ds;
        gridsecuestrado.DataBind();
        con.Close();
    }
    protected void btnsecuestro_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO BIENESSECUESTADOS(ItemBienSec_Id, Fiscal, FechaActSec, Investigador, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @Fiscal, @FechaActSec, @Investigador, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdBien.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter Fiscal = new SqlParameter("@Fiscal", SqlDbType.NVarChar, 250);
        Fiscal.Value = txtsecfiscal.Text.Trim().ToUpper();
        cmd.Parameters.Add(Fiscal);
        SqlParameter FechaActSec = new SqlParameter("@FechaActSec", SqlDbType.DateTime);
        FechaActSec.Value = Convert.ToDateTime(txtsecfechasec.Text.Trim());
        cmd.Parameters.Add(FechaActSec);
        SqlParameter Investigador = new SqlParameter("Investigador", SqlDbType.NVarChar, 250);
        Investigador.Value = txtsecinvestig.Text.Trim().ToUpper();
        cmd.Parameters.Add(Investigador);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaSecuestrado();
        MuestraSecuestrado();
    }
    //BIENES INCAUTADOS
    private void limpiaIncautado()
    {
        txtincaresol.Text = "";
        txtincafecha.Text = "";
        txtincaautoridad.Text = "";
        txtincaresol.Focus();
    }

    private void MuestraIncautado()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT BInc_Id AS BI1, NroResol AS BI2, Fechares AS BI3, Autoridad AS BI4 FROM BIENESINCAUTADOS WHERE (ItemBienSec_Id =" + Convert.ToInt32(LblIdBien.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridincautado.DataSource = ds;
        gridincautado.DataBind();
        con.Close();
    }
    protected void btnincautado_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO BIENESINCAUTADOS(ItemBienSec_Id, NroResol, Fechares, Autoridad, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @NroResol, @Fechares, @Autoridad, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdBien.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter NroResol = new SqlParameter("@NroResol", SqlDbType.NChar, 30);
        NroResol.Value = txtincaresol.Text.Trim().ToUpper();
        cmd.Parameters.Add(NroResol);
        SqlParameter Fechares = new SqlParameter("@Fechares", SqlDbType.DateTime);
        Fechares.Value = Convert.ToDateTime(txtincafecha.Text.Trim());
        cmd.Parameters.Add(Fechares);
        SqlParameter Autoridad = new SqlParameter("@Autoridad", SqlDbType.NVarChar, 300);
        Autoridad.Value = txtincaautoridad.Text.Trim().ToUpper();
        cmd.Parameters.Add(Autoridad);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaIncautado();
        MuestraIncautado();
    }
    //BIENES CONFISCADOS
    private void limpiaConfiscado()
    {
        txtconfissentencia.Text = "";
        txtconfisfecha.Text = "";
        txtconfisautoridad.Text = "";
        txtconfissentencia.Focus();
    }
    private void MuestraConfiscado()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT BConf_Id AS BC1, NumSentJud AS BC2, FechaSenjud AS BC3, Autoridad AS BC4 FROM BIENESCONFISCADOS WHERE (ItemBienSec_Id = " + Convert.ToInt32(LblIdBien.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        GridView9.DataSource = ds;
        GridView9.DataBind();
        con.Close();
    }
    protected void btnconfiscado_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO BIENESCONFISCADOS(ItemBienSec_Id, NumSentJud, FechaSenjud, Autoridad, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @NumSentJud, @FechaSenjud, @Autoridad, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdBien.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter NumSentJud = new SqlParameter("@NumSentJud", SqlDbType.NChar, 30);
        NumSentJud.Value = txtconfissentencia.Text.Trim().ToUpper();
        cmd.Parameters.Add(NumSentJud);
        SqlParameter FechaSenjud = new SqlParameter("@FechaSenjud", SqlDbType.DateTime);
        FechaSenjud.Value = Convert.ToDateTime(txtconfisfecha.Text.Trim());
        cmd.Parameters.Add(FechaSenjud);
        SqlParameter Autoridad = new SqlParameter("@Autoridad", SqlDbType.NVarChar, 300);
        Autoridad.Value = txtconfisautoridad.Text.Trim().ToUpper();
        cmd.Parameters.Add(Autoridad);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaConfiscado();
        MuestraConfiscado();
    }
    //PERDIDAD DE DOMINIO
    private void limpiaDominio()
    {
        txtpdfiscalia.Text = "";
        txtpdrequerim.Text = "";
        txtpdfecha.Text = "";
        txtpdfiscalia.Focus();
    }
    private void MuestraDominio()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT PerDom_Id AS PD1, Fiscalia AS PD2, Fechares AS PD3, Autoridad AS PD4 FROM PERDIDADOMINIO WHERE (ItemBienSec_Id = " + Convert.ToInt32(LblIdBien.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridperdidadom.DataSource = ds;
        gridperdidadom.DataBind();
        con.Close();
    }
    protected void btnperdidadom_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO PERDIDADOMINIO (ItemBienSec_Id, Fiscalia, Fechares, Autoridad, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @Fiscalia, @Fechares, @Autoridad, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdBien.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter Fiscalia = new SqlParameter("@Fiscalia", SqlDbType.NVarChar, 100);
        Fiscalia.Value = txtpdfiscalia.Text.Trim().ToUpper();
        cmd.Parameters.Add(Fiscalia);
        SqlParameter Fechares = new SqlParameter("@Fechares", SqlDbType.DateTime);
        Fechares.Value = Convert.ToDateTime(txtpdfecha.Text.Trim());
        cmd.Parameters.Add(Fechares);
        SqlParameter Autoridad = new SqlParameter("@Autoridad", SqlDbType.NVarChar, 300);
        Autoridad.Value = txtpdrequerim.Text.Trim().ToUpper();
        cmd.Parameters.Add(Autoridad);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaDominio();
        MuestraDominio();
    }
    //SITUACION DEL BIEN Y ENTREGAS
    private void limpiaEstado()
    {
        txtentfechabien.Text = "";
        txtentpersonal.Text = "";
        txtentrecibe.Text = "";
        txtentinstitucion.Text = "";
        txtentubicacion.Text = "";
        txtentfecha.Text = "";
        txtentfiscal.Text = "";
        CalidadBien();
        txtentfecha.Focus();
    }
    private void CalidadBien()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT CalB_Id, Descripcion FROM CALIDADBIEN";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        DropDownList2.ClearSelection();
        DropDownList2.Items.Clear();
        DropDownList2.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            DropDownList2.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void Muestraestado()
    {
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        con.Open();
        SqlDataAdapter cmd = new SqlDataAdapter("SELECT SITUACIONBIENES.SitB_Id AS SitB1, SITUACIONBIENES.Fechareq AS SitB, SITUACIONBIENES.fisreq AS SitB0, SITUACIONBIENES.FechaEnt AS SitB7, SITUACIONBIENES.ResponsableE AS SitB8, SITUACIONBIENES.ResponsableR AS SitB9, SITUACIONBIENES.Institucion AS SitB10, SITUACIONBIENES.Ubicacion AS SitB11 FROM SITUACIONBIENES INNER JOIN CALIDADBIEN ON SITUACIONBIENES.CalB_Id = CALIDADBIEN.CalB_Id WHERE (SITUACIONBIENES.ItemBienSec_Id = " + Convert.ToInt32(LblIdBien.Text.Trim()) + ")", con);
        DataSet ds = new DataSet();
        cmd.Fill(ds);
        gridentrega.DataSource = ds;
        gridentrega.DataBind();
        con.Close();
    }
    protected void btnentrega_Click(object sender, EventArgs e)
    {
        DateTime ahora = DateTime.Now;
        SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlCommand cmd = new SqlCommand();
        cmd.CommandText = "INSERT INTO SITUACIONBIENES(ItemBienSec_Id, Fechareq, fisreq, CalB_Id, FechaEnt, ResponsableE, ResponsableR, Institucion, Ubicacion, fechahoraing, Usuario) VALUES (@ItemBienSec_Id, @Fechareq, @fisreq, @CalB_Id, @FechaEnt, @ResponsableE, @ResponsableR, @Institucion, @Ubicacion, @fechahoraing, @Usuario)";
        cmd.CommandType = CommandType.Text;
        cmd.Connection = con;
        SqlParameter ItemBienSec_Id = new SqlParameter("@ItemBienSec_Id", SqlDbType.Int);
        ItemBienSec_Id.Value = Convert.ToInt32(LblIdBien.Text.Trim());
        cmd.Parameters.Add(ItemBienSec_Id);
        SqlParameter Fechareq = new SqlParameter("@Fechareq", SqlDbType.DateTime);
        Fechareq.Value = Convert.ToDateTime(txtentfecha.Text.Trim());
        cmd.Parameters.Add(Fechareq);
        SqlParameter fisreq = new SqlParameter("fisreq", SqlDbType.NVarChar, 300);
        fisreq.Value = txtentfiscal.Text.Trim().ToUpper();
        cmd.Parameters.Add(fisreq);
        SqlParameter CalB_Id = new SqlParameter("@CalB_Id", SqlDbType.Int);
        CalB_Id.Value = Convert.ToInt32(DropDownList2.SelectedValue.ToString());
        cmd.Parameters.Add(CalB_Id);
        SqlParameter FechaEnt = new SqlParameter("@FechaEnt", SqlDbType.DateTime);
        FechaEnt.Value = Convert.ToDateTime(txtentfechabien.Text.Trim());
        cmd.Parameters.Add(FechaEnt);
        SqlParameter ResponsableE = new SqlParameter("@ResponsableE", SqlDbType.NVarChar, 150);
        ResponsableE.Value = txtentpersonal.Text.Trim().ToUpper();
        cmd.Parameters.Add(ResponsableE);
        SqlParameter ResponsableR = new SqlParameter("@ResponsableR", SqlDbType.NVarChar, 150);
        ResponsableR.Value = txtentrecibe.Text.Trim().ToUpper();
        cmd.Parameters.Add(ResponsableR);
        SqlParameter Institucion = new SqlParameter("@Institucion", SqlDbType.NVarChar, 150);
        Institucion.Value = txtentinstitucion.Text.Trim().ToUpper();
        cmd.Parameters.Add(Institucion);
        SqlParameter Ubicacion = new SqlParameter("@Ubicacion", SqlDbType.NVarChar, 150);
        Ubicacion.Value = txtentubicacion.Text.Trim().ToUpper();
        cmd.Parameters.Add(Ubicacion);
        SqlParameter fechahoraing = new SqlParameter("@fechahoraing", SqlDbType.DateTime);
        fechahoraing.Value = ahora;
        cmd.Parameters.Add(fechahoraing);
        SqlParameter Usuario = new SqlParameter("@Usuario", SqlDbType.NChar, 15);
        Usuario.Value = pase.Trim();
        cmd.Parameters.Add(Usuario);
        con.Open();
        int result = cmd.ExecuteNonQuery();
        con.Close();
        limpiaEstado();
        Muestraestado();
    }
    //BASE DE DATOS DOCUMENTAL
    public void ComboTipoDocum()
    {
        DataTable dt = new DataTable();
        SqlConnection SqlConn = new SqlConnection(ValoresGlobales.CONEXSIII);
        SqlConn.Open();
        string sql = "SELECT ContBien_Id, Descripcion FROM CONTENIDOBIEN";
        SqlCommand cmd = new SqlCommand(sql);
        cmd.CommandType = CommandType.Text;
        cmd.Connection = SqlConn;
        SqlDataAdapter sd = new SqlDataAdapter(cmd);
        Ddldescrip.ClearSelection();
        Ddldescrip.Items.Clear();
        Ddldescrip.Items.Add("Seleccione un Dato");
        sd.Fill(dt);
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            Ddldescrip.Items.Add(new ListItem(dt.Rows[i][1].ToString(), dt.Rows[i][0].ToString()));
        }
        SqlConn.Close();
    }
    private void limpiadoc()
    {
        ComboTipoDocum();
        txtnombredoc.Text = "";
        fudocum.Dispose();
        ddltipodocumento.SelectedIndex = ddltipodocumento.Items.IndexOf(ddltipodocumento.Items.FindByValue("DOCUMENTO"));
    }
    private void deletearchivo(string codigo)
    {
        string sql = "Delete ARCHIVOSBIENES Where ArchB_Id =" + codigo;
        SqlConnection conn = new SqlConnection(ValoresGlobales.CONEXSIII);
        conn.Open();
        SqlCommand cmd = new SqlCommand(sql, conn);
        cmd.ExecuteNonQuery();
        conn.Close();
        conn.Dispose();
    }
    private void Muestraarchivos()
    {
        using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.CommandText = "SELECT ARCHIVOSBIENES.ArchB_Id AS Id, CONTENIDOBIEN.Descripcion AS A1, ARCHIVOSBIENES.Tipo AS A2, ARCHIVOSBIENES.Nombre AS A3, ARCHIVOSBIENES.NombreArch AS A4 FROM ARCHIVOSBIENES INNER JOIN CONTENIDOBIEN ON ARCHIVOSBIENES.ContBien_Id = CONTENIDOBIEN.ContBien_Id WHERE (ARCHIVOSBIENES.Casos_Id = " + Convert.ToInt32(lblidcaso.Text.Trim()) + ")";
                cmd.Connection = con;
                con.Open();
                gridbdbienes.DataSource = cmd.ExecuteReader();
                gridbdbienes.DataBind();
                con.Close();
            }
        }
    }
    protected void DownloadFile(object sender, EventArgs e)
    {
        int id = int.Parse((sender as LinkButton).CommandArgument);
        byte[] bytes;
        string fileName;
        using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
        {
            using (SqlCommand cmd = new SqlCommand())
            {
                cmd.CommandText = "select NombreArch, Data from ARCHIVOSBIENES where ArchB_Id=@Id";
                cmd.Parameters.AddWithValue("@Id", id);
                cmd.Connection = con;
                con.Open();
                using (SqlDataReader sdr = cmd.ExecuteReader())
                {
                    sdr.Read();
                    bytes = (byte[])sdr["Data"];
                    fileName = sdr["NombreArch"].ToString();
                }
                con.Close();
            }
        }
        Response.Clear();
        Response.Buffer = true;
        Response.Charset = "";
        Response.Cache.SetCacheability(HttpCacheability.NoCache);
        Response.AppendHeader("Content-Disposition", "attachment; filename=" + fileName);
        Response.BinaryWrite(bytes);
        Response.Flush();
        Response.End();
    }
    protected void btnentregaarchivo_Click(object sender, EventArgs e)
    {
        string getFileName;
        string contentType;
        if ((fudocum.PostedFile != null) && (fudocum.PostedFile.ContentLength > 0))
        {
            getFileName = fudocum.FileName.ToString();
            contentType = fudocum.PostedFile.ContentType;
            using (Stream fs = fudocum.PostedFile.InputStream)
            {
                using (BinaryReader br = new BinaryReader(fs))
                {
                    byte[] bytes = br.ReadBytes((Int32)fs.Length);
                    using (SqlConnection con = new SqlConnection(ValoresGlobales.CONEXSIII))
                    {
                        string query = "insert into ARCHIVOSBIENES values (@Casos_Id, @ContBien_Id, @Tipo, @Nombre, @NombreArch, @Data)";
                        using (SqlCommand cmd = new SqlCommand(query))
                        {
                            cmd.Connection = con;
                            cmd.Parameters.AddWithValue("@Casos_Id", Convert.ToInt32(lblidcaso.Text.Trim()));
                            cmd.Parameters.AddWithValue("@ContBien_Id", Convert.ToInt32(Ddldescrip.SelectedValue.Trim()));
                            cmd.Parameters.AddWithValue("@Tipo", ddltipodocumento.SelectedValue.Trim());
                            cmd.Parameters.AddWithValue("@Nombre", txtnombredoc.Text.Trim().ToUpper());
                            cmd.Parameters.AddWithValue("@NombreArch", getFileName.Trim());
                            cmd.Parameters.AddWithValue("@Data", bytes);
                            con.Open();
                            cmd.ExecuteNonQuery();
                            con.Close();
                        }
                    }
                }
            }
        }
        Muestraarchivos();
        limpiadoc();
    }

    protected void gridbdbienes_RowDeleting(object sender, GridViewDeleteEventArgs e)
    {
        string id = gridbdbienes.Rows[e.RowIndex].Cells[0].Text;
        deletearchivo(id);
        Muestraarchivos();
    }
}